import {
    Command,
    EvaluateCommandAuthRule,
    EvaluateCommandRule,
    Aggregate,
    EvaluateIndexRule,
    EventStream,
    ValidateCommand,
    DomainEvent,
    runCreateCommand,
    HandleCreateCommand,
    runUpsertCommand,
    runUpdateCommand,
    HandleUpdateCommand,
    HandleUpsertCommand,
    EvolverSetsForAggregate,
    CommandEventData,
    EvaluateUpdateAggregateRule,
    EvaluateUpdateAggregateAuthRule,
    EvaluateUpsertAggregateRule,
    EvaluateUpsertAggregateAuthRule,
} from '@root/domain';
import { HandleRequestInput } from '@root/api-rest';
import httpMocks from 'node-mocks-http';
import { JwtCustomContent, decodeJwt, generateJwt } from '@root/jwt';
import {
    BaseEventAndEvolverBuilder,
    FinalEventAndEvolverBuilder,
    createEventAndEvolverBuilder,
} from './EventAndEvolverBuilder';
import { BaseLogger } from '@echo/lib-common';

interface HandleRequestInput_ForCommand<C extends Command, A extends Aggregate> {
    toCreateAggregate(aggregateName: string): HandleRequestInput_ForCreateCommand<C, A>;
    toUpdateAggregate(aggregateName: string): HandleRequestInput_ForUpdateCommand<C, A>;
    toUpsertAggregate(aggregateName: string): HandleRequestInput_ForUpsertCommand<C, A>;
}

interface HandleRequestInput_ForCreateCommand<C extends Command, A extends Aggregate> {
    withNoJwt(): HandleRequestInput_ForCreateCommand<C, A>;
    withCustomJwt(jwtContent: JwtCustomContent): HandleRequestInput_ForCreateCommand<C, A>;
    withExistingEventAndEvolver<ED extends CommandEventData, DE extends DomainEvent<string, ED>>(
        aggregateName: string,
        callback: (build: BaseEventAndEvolverBuilder<ED, DE, A>) => FinalEventAndEvolverBuilder<ED, DE, A>
    ): HandleRequestInput_ForCreateCommand<C, A>;
    withOtherExistingAggregateStream(
        aggregateName: string,
        aggregateId: string
    ): HandleRequestInput_ForCreateCommand<C, A>;

    withCommand(command: C): HandleRequestInput_ForCreateCommand<C, A>;
    withValidator(validator: ValidateCommand<C>): HandleRequestInput_ForCreateCommand<C, A>;
    withCreateHandler(handler: HandleCreateCommand<C>): HandleRequestInput_ForCreateCommand<C, A>;

    withCommandAuthRules(commandAuthRules: EvaluateCommandAuthRule<C>[]): HandleRequestInput_ForCreateCommand<C, A>;
    withCommandRules(commandRules: EvaluateCommandRule<C>[]): HandleRequestInput_ForCreateCommand<C, A>;
    withIndexRules(indexRules: EvaluateIndexRule<C>[]): HandleRequestInput_ForCreateCommand<C, A>;

    build(): HandleRequestInput<C>;
}

interface HandleRequestInput_ForUpdateCommand<C extends Command, A extends Aggregate> {
    withNoJwt(): HandleRequestInput_ForUpdateCommand<C, A>;
    withCustomJwt(jwtContent: JwtCustomContent): HandleRequestInput_ForUpdateCommand<C, A>;
    withExistingEventAndEvolver<ED extends CommandEventData, DE extends DomainEvent<string, ED>>(
        aggregateName: string,
        callback: (build: BaseEventAndEvolverBuilder<ED, DE, A>) => FinalEventAndEvolverBuilder<ED, DE, A>
    ): HandleRequestInput_ForUpdateCommand<C, A>;
    withOtherExistingAggregateStream(
        aggregateName: string,
        aggregateId: string
    ): HandleRequestInput_ForUpdateCommand<C, A>;

    withCommand(command: C): HandleRequestInput_ForUpdateCommand<C, A>;
    withValidator(validator: ValidateCommand<C>): HandleRequestInput_ForUpdateCommand<C, A>;
    withUpdateHandler(handler: HandleUpdateCommand<C, A>): HandleRequestInput_ForUpdateCommand<C, A>;

    withCommandAuthRules(commandAuthRules: EvaluateCommandAuthRule<C>[]): HandleRequestInput_ForUpdateCommand<C, A>;
    withCommandRules(commandRules: EvaluateCommandRule<C>[]): HandleRequestInput_ForUpdateCommand<C, A>;
    withIndexRules(indexRules: EvaluateIndexRule<C>[]): HandleRequestInput_ForUpdateCommand<C, A>;

    withUpdateAggregateAuthRules(
        aggregateAuthRules: EvaluateUpdateAggregateAuthRule<C, A>[]
    ): HandleRequestInput_ForUpdateCommand<C, A>;
    withUpdateAggregateRules(
        aggregateRules: EvaluateUpdateAggregateRule<C, A>[]
    ): HandleRequestInput_ForUpdateCommand<C, A>;

    build(): HandleRequestInput<C>;
}

interface HandleRequestInput_ForUpsertCommand<C extends Command, A extends Aggregate> {
    withNoJwt(): HandleRequestInput_ForUpsertCommand<C, A>;
    withCustomJwt(jwtContent: JwtCustomContent): HandleRequestInput_ForUpsertCommand<C, A>;
    withExistingEventAndEvolver<ED extends CommandEventData, DE extends DomainEvent<string, ED>>(
        aggregateName: string,
        callback: (build: BaseEventAndEvolverBuilder<ED, DE, A>) => FinalEventAndEvolverBuilder<ED, DE, A>
    ): HandleRequestInput_ForUpsertCommand<C, A>;
    withOtherExistingAggregateStream(
        aggregateName: string,
        aggregateId: string
    ): HandleRequestInput_ForUpsertCommand<C, A>;

    withCommand(command: C): HandleRequestInput_ForUpsertCommand<C, A>;
    withValidator(validator: ValidateCommand<C>): HandleRequestInput_ForUpsertCommand<C, A>;
    withUpsertHandler(handler: HandleUpsertCommand<C, A>): HandleRequestInput_ForUpsertCommand<C, A>;

    withCommandAuthRules(commandAuthRules: EvaluateCommandAuthRule<C>[]): HandleRequestInput_ForUpsertCommand<C, A>;
    withCommandRules(commandRules: EvaluateCommandRule<C>[]): HandleRequestInput_ForUpsertCommand<C, A>;
    withIndexRules(indexRules: EvaluateIndexRule<C>[]): HandleRequestInput_ForUpsertCommand<C, A>;

    withUpsertAggregateAuthRules(
        aggregateAuthRules: EvaluateUpsertAggregateAuthRule<C, A>[]
    ): HandleRequestInput_ForUpsertCommand<C, A>;
    withUpsertAggregateRules(
        aggregateRules: EvaluateUpsertAggregateRule<C, A>[]
    ): HandleRequestInput_ForUpsertCommand<C, A>;

    build(): HandleRequestInput<C>;
}

class HandleRequestInputBuilder<C extends Command, A extends Aggregate>
    implements
        HandleRequestInput_ForCommand<C, A>,
        HandleRequestInput_ForCreateCommand<C, A>,
        HandleRequestInput_ForUpdateCommand<C, A>,
        HandleRequestInput_ForUpsertCommand<C, A>
{
    private _raiseEvents: (streamName: string, aggregateId: string, events: DomainEvent<string>[]) => Promise<void>;
    private _response: httpMocks.MockResponse<any>;
    private _baseLogger: BaseLogger;

    private _aggregateName: string | undefined;

    private _eventIndex: number = 0;
    private _commandType: 'create' | 'update' | 'upsert' | 'unset' = 'unset';

    private _command: C | undefined;
    private _validator: ValidateCommand<C> | undefined;
    private _createHandler: HandleCreateCommand<C> | undefined;
    private _updateHandler: HandleUpdateCommand<C, A> | undefined;
    private _upsertHandler: HandleUpsertCommand<C, A> | undefined;
    private _commandAuthRules: EvaluateCommandAuthRule<C>[] = [];
    private _commandRules: EvaluateCommandRule<C>[] = [];
    private _updateAggregateAuthRules: EvaluateUpdateAggregateAuthRule<C, A>[] = [];
    private _updateAggregateRules: EvaluateUpdateAggregateRule<C, A>[] = [];
    private _upsertAggregateAuthRules: EvaluateUpsertAggregateAuthRule<C, A>[] = [];
    private _upsertAggregateRules: EvaluateUpsertAggregateRule<C, A>[] = [];
    private _indexRules: EvaluateIndexRule<C>[] = [];

    private _jwtContent: JwtCustomContent | undefined = {
        sub: '1234567890',
        firstName: 'Bob',
        lastName: 'Builder',
        email: 'bob@builder.com',
        profilePicture: undefined,
    };

    private _evolversSet: EvolverSetsForAggregate<A> | undefined = undefined;
    private _aggregateStreams: Record<string, DomainEvent<string, CommandEventData>[]> = {};
    private _generateUuid: () => string = () => 'uuid';

    public constructor(
        raiseEvents: (streamName: string, aggregateId: string, events: DomainEvent<string>[]) => Promise<void>,
        response: httpMocks.MockResponse<any>,
        baseLogger: BaseLogger
    ) {
        this._raiseEvents = raiseEvents;
        this._response = response;
        this._baseLogger = baseLogger;
    }

    public toCreateAggregate(aggregateName: string): HandleRequestInput_ForCreateCommand<C, A> {
        this._aggregateName = aggregateName;
        this._commandType = 'create';
        return this;
    }
    public toUpdateAggregate(aggregateName: string): HandleRequestInput_ForUpdateCommand<C, A> {
        this._aggregateName = aggregateName;
        this._commandType = 'update';
        return this;
    }
    public toUpsertAggregate(aggregateName: string): HandleRequestInput_ForUpsertCommand<C, A> {
        this._aggregateName = aggregateName;
        this._commandType = 'upsert';
        return this;
    }

    public withCommand(command: C) {
        this._command = command;
        return this;
    }

    public withExistingEventAndEvolver<
        ED extends CommandEventData,
        DE extends DomainEvent<string, ED>,
        A extends Aggregate,
    >(
        aggregateName: string,
        callback: (build: BaseEventAndEvolverBuilder<ED, DE, A>) => FinalEventAndEvolverBuilder<ED, DE, A>
    ) {
        const builder = callback(createEventAndEvolverBuilder<ED, DE, A>(this._eventIndex));
        this._eventIndex++;

        // event
        const event = builder.buildEvent();
        const aggregateStreamName = `${aggregateName}-${event.aggregateId}`;
        if (!this._aggregateStreams[aggregateStreamName]) {
            this._aggregateStreams[aggregateStreamName] = [];
        }
        this._aggregateStreams[aggregateStreamName].push(event);

        // evolvers
        if (!this._evolversSet) {
            this._evolversSet = {
                aggregateName: aggregateName,
                createEventEvolverSets: [],
                updateEventEvolverSets: [],
                upsertEventEvolverSets: [],
            };
        }

        if (builder.getEventKind() === 'create') {
            const evolver = builder.buildCreateEvolver();
            if (evolver) {
                this._evolversSet.createEventEvolverSets.push({
                    eventName: event.type,
                    evolver: evolver as any, // TODO: improve typing
                });
            }
        } else if (builder.getEventKind() === 'update') {
            const evolver = builder.buildUpdateEvolver();
            if (evolver) {
                this._evolversSet.updateEventEvolverSets.push({
                    eventName: event.type,
                    evolver: evolver as any, // TODO: improve typing
                });
            }
        } else if (builder.getEventKind() === 'upsert') {
            const evolver = builder.buildUpsertEvolver();
            if (evolver) {
                this._evolversSet.upsertEventEvolverSets.push({
                    eventName: event.type,
                    evolver: evolver as any, // TODO: improve typing
                });
            }
        }

        return this;
    }

    public withOtherExistingAggregateStream(aggregateName: string, aggregateId: string) {
        this._aggregateStreams[`${aggregateName}-${aggregateId}`] = [
            { id: 'jklm', type: 'other', aggregateId: aggregateId, data: {}, meta: { correlationId: '' } },
        ];
        return this;
    }

    public withNoJwt() {
        this._jwtContent = undefined;
        return this;
    }

    public withCustomJwt(jwtContent: JwtCustomContent) {
        this._jwtContent = jwtContent;
        return this;
    }

    public withValidator(validator: ValidateCommand<C>) {
        this._validator = validator;
        return this;
    }

    public withCreateHandler(handler: HandleCreateCommand<C>) {
        this._createHandler = handler;
        return this;
    }
    public withUpdateHandler(handler: HandleUpdateCommand<C, A>) {
        this._updateHandler = handler;
        return this;
    }
    public withUpsertHandler(handler: HandleUpsertCommand<C, A>) {
        this._upsertHandler = handler;
        return this;
    }

    public withCommandAuthRules(commandAuthRules: EvaluateCommandAuthRule<C>[]) {
        this._commandAuthRules = commandAuthRules;
        return this;
    }
    public withCommandRules(commandRules: EvaluateCommandRule<C>[]): HandleRequestInputBuilder<C, A> {
        this._commandRules = commandRules;
        return this;
    }
    public withUpdateAggregateAuthRules(aggregateAuthRules: EvaluateUpdateAggregateAuthRule<C, A>[]) {
        this._updateAggregateAuthRules = aggregateAuthRules;
        return this;
    }
    public withUpdateAggregateRules(aggregateRules: EvaluateUpdateAggregateRule<C, A>[]) {
        this._updateAggregateRules = aggregateRules;
        return this;
    }
    public withUpsertAggregateAuthRules(aggregateAuthRules: EvaluateUpsertAggregateAuthRule<C, A>[]) {
        this._upsertAggregateAuthRules = aggregateAuthRules;
        return this;
    }
    public withUpsertAggregateRules(aggregateRules: EvaluateUpsertAggregateRule<C, A>[]) {
        this._upsertAggregateRules = aggregateRules;
        return this;
    }
    public withIndexRules(indexRules: EvaluateIndexRule<C>[]) {
        this._indexRules = indexRules;
        return this;
    }
    public withExistingAggregateStream(
        aggregateName: string,
        aggregateId: string,
        eventStream: DomainEvent<string, CommandEventData>[]
    ) {
        this._aggregateStreams[`${aggregateName}-${aggregateId}`] = eventStream;
        return this;
    }

    public build(): HandleRequestInput<C> {
        let requestHeaders = {};
        if (this._jwtContent) {
            const jwtString = generateJwt(this._jwtContent);
            requestHeaders = { authorization: `Bearer ${jwtString}` };
            // const jwtObj = decodeJwt(jwtString);
            // console.log(JSON.stringify(jwtObj, null, 4));
        }

        const aggregateName = this._aggregateName;
        if (!aggregateName) {
            throw new Error('aggregate name is required');
        }

        const command = this._command;
        if (!command) {
            throw new Error('command is required');
        }

        const validator = this._validator || ((command) => []);

        const eventStream: EventStream = {
            findEvents: (streamName: string, aggregateId: string) => {
                return Promise.resolve(this._aggregateStreams[`${streamName}-${aggregateId}`]);
            },
            addEvents: (streamName, aggregateId, events) => {
                let stream = this._aggregateStreams[`${streamName}-${aggregateId}`];
                if (!stream) {
                    stream = [];
                }
                stream.push(...events);
                this._raiseEvents(streamName, aggregateId, events);
                return Promise.resolve();
            },
        };

        if (this._commandType === 'create') {
            const createHandler = this._createHandler || (() => []);
            if (this._evolversSet) {
                throw new Error('evolvers should not exist for create handler');
            }
            return {
                requestBody: command,
                requestHeaders: requestHeaders,
                response: this._response,
                commandRunner: async (command, context, metadata) =>
                    runCreateCommand({
                        aggregateName: aggregateName,
                        command: command,
                        handle: createHandler,
                        validator: validator,
                        commandAuthRules: this._commandAuthRules,
                        commandRules: this._commandRules,
                        indexRules: this._indexRules,
                        context: context,
                        metadata: metadata,
                    }),
                baseLogger: this._baseLogger,
                uuidv4: () => '',
                eventStream: eventStream,
            };
        }
        if (this._commandType === 'update') {
            const updateHandler = this._updateHandler || (() => []);
            const evolversSet = this._evolversSet;
            if (!evolversSet) {
                throw new Error('evolvers are required for upsert handler');
            }
            return {
                requestBody: command,
                requestHeaders: requestHeaders,
                response: this._response,
                commandRunner: async (command, context, metadata) =>
                    runUpdateCommand({
                        aggregateName: aggregateName,
                        command: command,
                        handle: updateHandler,
                        validator: validator,
                        commandAuthRules: this._commandAuthRules,
                        commandRules: this._commandRules,
                        evolvers: evolversSet,
                        aggregateAuthRules: this._updateAggregateAuthRules,
                        aggregateRules: this._updateAggregateRules,
                        indexRules: this._indexRules,
                        context: context,
                        metadata: metadata,
                    }),
                baseLogger: this._baseLogger,
                uuidv4: () => '',
                eventStream: eventStream,
            };
        }
        if (this._commandType === 'upsert') {
            const upsertHandler = this._upsertHandler || (() => []);
            const evolversSet = this._evolversSet || {
                aggregateName: aggregateName,
                createEventEvolverSets: [],
                updateEventEvolverSets: [],
                upsertEventEvolverSets: [],
            };
            return {
                requestBody: command,
                requestHeaders: requestHeaders,
                response: this._response,
                commandRunner: async (command, context, metadata) =>
                    runUpsertCommand({
                        aggregateName: aggregateName,
                        command: command,
                        handle: upsertHandler,
                        validator: validator,
                        commandAuthRules: this._commandAuthRules,
                        commandRules: this._commandRules,
                        evolvers: evolversSet,
                        aggregateAuthRules: this._upsertAggregateAuthRules,
                        aggregateRules: this._upsertAggregateRules,
                        indexRules: this._indexRules,
                        context: context,
                        metadata: metadata,
                    }),
                baseLogger: this._baseLogger,
                uuidv4: () => '',
                eventStream: eventStream,
            };
        }

        throw new Error('unknown command type');
    }
}

export const createHandleRequestInputBuilder = <C extends Command, A extends Aggregate>(
    raiseEvents: (streamName: string, aggregateId: string, events: DomainEvent<string>[]) => Promise<void>,
    response: httpMocks.MockResponse<any>,
    baseLogger: BaseLogger
): HandleRequestInput_ForCommand<C, A> => new HandleRequestInputBuilder(raiseEvents, response, baseLogger);
