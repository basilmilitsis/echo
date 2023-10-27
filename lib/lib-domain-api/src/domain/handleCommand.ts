import { Logger } from '@echo/lib-common';
import {
    AggregateLoadError,
    CommandAggregateRuleError,
    CommandIndexRuleError,
    CommandRuleError,
    DomainError,
    ValidationError,
} from './errors';
import { EvolverSetsForAggregate, evolve } from './evolve';
import {
    Aggregate,
    Command,
    CommandAggregateRule,
    CommandEvent,
    CommandIndexRule,
    CommandRule,
    HandleCreateCommand,
    DomainEvent,
    EventStream,
    HandleUpdateCommand,
    ValidateCommand,
    HandleUpsertCommand,
} from './types';

const doValidation = <C extends Command>(command: C, validator: ValidateCommand<C>, logger: Logger): void => {
    logger.localDiagnostic('running validator...');
    const validationErrors = validator(command);
    if (validationErrors.length > 0) {
        throw new ValidationError('ERROR: Validation Failed', validationErrors);
    }
};

const doCommandRules = <C extends Command>(
    command: C,
    commandRules: CommandRule<C>[] | undefined,
    logger: Logger
): void => {
    if (!commandRules || commandRules.length === 0) {
        return;
    }

    logger.localDiagnostic('running command rules: ');
    for (let i = 0; i < commandRules.length; i++) {
        logger.localDiagnostic(`- rule: ${i}`);
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
    eventStream: EventStream,
    logger: Logger
): Promise<void> => {
    if (!commandIndexRules || commandIndexRules.length === 0) {
        return;
    }

    logger.localDiagnostic('running command index rules:');
    for (let i = 0; i < commandIndexRules.length; i++) {
        logger.localDiagnostic(`- rule: ${i}`);
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
    logger: Logger
): Promise<A> => {
    const aggregateEvents = await eventStream.findEvents(aggregateName, command.id);
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    logger.localDiagnosticWithObject('aggregate', aggregate);
    return aggregate;
};

const tryLoadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    eventStream: EventStream,
    evolvers: EvolverSetsForAggregate<A>[],
    logger: Logger
): Promise<A | undefined> => {
    const aggregateEvents = await eventStream.findEvents(aggregateName, command.id);
    if (!aggregateEvents || aggregateEvents.length === 0) {
        return undefined;
    }
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    logger.localDiagnosticWithObject('aggregate', aggregate);
    return aggregate;
};

const doCommandAggregateRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    logger: Logger
): void => {
    if (!commandAggregateRules || commandAggregateRules.length === 0) {
        return;
    }

    logger.localDiagnostic('running command aggregate rules:');
    for (let i = 0; i < commandAggregateRules.length; i++) {
        logger.localDiagnostic(`- rule: ${i}`);
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
    generateUuid: () => string,
    logger: Logger
): Promise<void> => {
    logger.localDiagnosticWithObjects('events to raise:', commandEvents);
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
    logger.localDiagnosticWithObjects('raising domainEvents:', domainEvents);
};

export const handleCreateCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    handle: HandleCreateCommand<C>,
    validator: ValidateCommand<C>,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    eventStream: EventStream,
    generateUuid: () => string,
    logger: Logger
) => {
    logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, logger);

    //-- command rules
    doCommandRules(command, commandRules, logger);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, eventStream, logger);

    //-- handle command
    logger.localDiagnostic('handle command');
    const commandEvents = handle(command);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, eventStream, generateUuid, logger);

    logger.localDiagnostic('========================================================================');
};

export const handleUpdateCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    evolvers: EvolverSetsForAggregate<A>[],
    handle: HandleUpdateCommand<C, A>,
    validator: ValidateCommand<C>,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    eventStream: EventStream,
    generateUuid: () => string,
    logger: Logger
) => {
    logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, logger);

    //-- command rules
    doCommandRules(command, commandRules, logger);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, eventStream, logger);

    //-- load aggregate
    const aggregate: A = await loadAggregate(command, aggregateName, eventStream, evolvers, logger);
    if (!aggregate) {
        throw new AggregateLoadError('ERROR: Aggregate not found');
    }

    //-- command aggregate rules
    doCommandAggregateRules(command, aggregate, commandAggregateRules, logger);

    //-- handle command
    logger.localDiagnostic('handle command');
    const commandEvents = handle(command, aggregate);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, eventStream, generateUuid, logger);

    logger.localDiagnostic('========================================================================');
};

export const handleUpsertCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    evolvers: EvolverSetsForAggregate<A>[],
    handle: HandleUpsertCommand<C, A>,
    validator: ValidateCommand<C>,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    eventStream: EventStream,
    generateUuid: () => string,
    logger: Logger
) => {
    logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, logger);

    //-- command rules
    doCommandRules(command, commandRules, logger);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, eventStream, logger);

    //-- load aggregate
    const aggregate: A | undefined = await tryLoadAggregate(command, aggregateName, eventStream, evolvers, logger);
    if (aggregate) {
        //-- command aggregate rules
        doCommandAggregateRules(command, aggregate, commandAggregateRules, logger);
    }

    //-- handle command
    logger.localDiagnostic('handle command');
    const commandEvents = handle(command, aggregate);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, eventStream, generateUuid, logger);

    logger.localDiagnostic('========================================================================');
};
