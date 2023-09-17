import { EvolverSetsForAggregate, evolve } from './evolve';
import { ValidationError, Validator } from './Validator';
import { CommandRule, CommandRuleError } from './CommandRule';
import { CommandIndexRule, CommandIndexRuleError } from './CommandIndexRule';
import { CommandAggregateRule, CommandAggregateRuleError } from './CommandAggregateRule';
import { AggregatLoadError } from './AggregateLoadError';
import { Command } from './Command';
import { Aggregate } from './Aggregate';
import { EventStream } from './EventStream';
import { CommandEvent } from './CommandEvent';
import { DomainEvent } from './DomainEvent';
import { CreateHandler } from './CreateHandler';
import { UpdateHandler } from './UpdateHandler';

const doValdiation = <C extends Command>(command: C, validator: Validator<C> | undefined): void => {
    if (!validator) {
        return;
    }
    console.log('======> running validator...');
    const validationErrors = validator(command);
    if (validationErrors.length > 0) {
        throw new ValidationError('ERROR: Validation Failed', validationErrors);
    }
};

const doCommandRules = <C extends Command>(command: C, commandRules: CommandRule<C>[] | undefined): void => {
    if (!commandRules) {
        return;
    }
    console.log('======> running command rules: ');
    for (let i = 0; i < commandRules.length; i++) {
        console.log('---------> rule: ', i);
        const commandRule = commandRules[i];
        const commandRuleErrors = commandRule(command);
        if (commandRuleErrors.length > 0) {
            throw new CommandRuleError('ERROR: Command Rule Failed', commandRuleErrors);
        }
    }
};

const doCommandIndexRules = async <C extends Command>(
    command: C,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    eventStream: EventStream
): Promise<void> => {
    if (!commandIndexRules) {
        return;
    }
    console.log('======> running command index rules: ');
    for (let i = 0; i < commandIndexRules.length; i++) {
        console.log('---------> rule: ', i);
        const commandIndexRule = commandIndexRules[i];
        const commandIndexRuleErrors = await commandIndexRule(command, eventStream);
        if (commandIndexRuleErrors.length > 0) {
            throw new CommandIndexRuleError('ERROR: Command Index Rule Failed', commandIndexRuleErrors);
        }
    }
};

const loadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    eventStream: EventStream,
    evolvers: EvolverSetsForAggregate<A>[],
): Promise<A> => {
    const aggregateEvents = await eventStream.findEvents(aggregateName, command.id);
    console.log('======> found events: ', JSON.stringify(aggregateEvents, null, 4));
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    console.log('======> aggregate ', JSON.stringify(aggregate, null, 4));
    return aggregate;
};

const doCommandAggregateRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
): void => {
    if (!commandAggregateRules) {
        return;
    }
    console.log('======> running command aggregate rules...');
    for (let i = 0; i < commandAggregateRules.length; i++) {
        console.log('---------> rule: ', i);
        const commandAggregateRule = commandAggregateRules[i];
        const commandAggregateRuleErrors = commandAggregateRule(command, aggregate);
        if (commandAggregateRuleErrors.length > 0) {
            throw new CommandAggregateRuleError('ERROR: Command Aggregate Rule Failed', commandAggregateRuleErrors);
        }
    }
};
const raiseEvents = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    commandEvents: CommandEvent[],
    eventStream: EventStream,
    generateUuid: () => string
): Promise<void> => {
    console.log('======> handled events ', JSON.stringify(commandEvents, null, 4));
    const domainEvents: DomainEvent<string>[] = commandEvents.map(
        (x): DomainEvent<string> => ({
            id: generateUuid(),
            type: x.type,
            //kind: DomainEventKind.Create,
            aggregateId: x.id,
            data: x.data,
            meta: {
                correlationId: '', // TODO
            },
        })
    );
    await eventStream.addEvents(aggregateName, command.id, domainEvents);
    console.log('======> added domainEvents ', JSON.stringify(domainEvents, null, 4));
};





export const handleCreateCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    handle: CreateHandler<C>,
    validator: Validator<C> | undefined,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    eventStream: EventStream,
    generateUuid: () => string
) => {
    console.log('========================================================================');

    //-- validator
    doValdiation(command, validator);

    //-- command rules
    doCommandRules(command, commandRules);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, eventStream);

    //-- handle command
    const commandEvents = handle(command);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, eventStream, generateUuid);

    console.log('========================================================================');
};

export const handleUpdateCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    evolvers: EvolverSetsForAggregate<A>[],
    handle: UpdateHandler<C, A>,
    validator: Validator<C> | undefined,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    eventStream: EventStream,
    generateUuid: () => string
) => {
    console.log('========================================================================');

    //-- validator
    doValdiation(command, validator);

    //-- command rules
    doCommandRules(command, commandRules);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, eventStream);

    //-- load aggregate
    const aggregate: A = await loadAggregate(command, aggregateName, eventStream, evolvers);
    if(!aggregate) {
        throw new AggregatLoadError('ERROR: Aggregate not found');
    }

    //-- command aggregate rules
    doCommandAggregateRules(command, aggregate, commandAggregateRules);

    //-- handle command
    const commandEvents = handle(command, aggregate);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, eventStream, generateUuid);

    console.log('========================================================================');
};

