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
    HandleUpdateCommand,
    ValidateCommand,
    HandleUpsertCommand,
    CommandContext,
    CommandMetadata,
} from './types';

const doValidation = <C extends Command>(command: C, validator: ValidateCommand<C>, context: CommandContext): void => {
    context.logger.localDiagnostic('running validator...');
    const validationErrors = validator(command);
    if (validationErrors.length > 0) {
        throw new ValidationError('ERROR: Validation Failed', validationErrors);
    }
};

const doCommandRules = <C extends Command>(
    command: C,
    commandRules: CommandRule<C>[] | undefined,
    context: CommandContext
): void => {
    if (!commandRules || commandRules.length === 0) {
        return;
    }

    context.logger.localDiagnostic('running command rules: ');
    for (let i = 0; i < commandRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
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
    context: CommandContext
): Promise<void> => {
    if (!commandIndexRules || commandIndexRules.length === 0) {
        return;
    }

    context.logger.localDiagnostic('running command index rules:');
    for (let i = 0; i < commandIndexRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const commandIndexRule = commandIndexRules[i];
        const commandIndexRuleErrors = await commandIndexRule(command, context.eventStream);
        if (commandIndexRuleErrors.length > 0) {
            throw new CommandIndexRuleError('ERROR: Command Index Rule Failed', commandIndexRuleErrors);
        }
    }
};

const loadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    evolvers: EvolverSetsForAggregate<A>[],
    context: CommandContext
): Promise<A> => {
    const aggregateEvents = await context.eventStream.findEvents(aggregateName, command.id);
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    context.logger.localDiagnosticWithObject('aggregate', aggregate);
    return aggregate;
};

const tryLoadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    evolvers: EvolverSetsForAggregate<A>[],
    context: CommandContext
): Promise<A | undefined> => {
    const aggregateEvents = await context.eventStream.findEvents(aggregateName, command.id);
    if (!aggregateEvents || aggregateEvents.length === 0) {
        return undefined;
    }
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    context.logger.localDiagnosticWithObject('aggregate', aggregate);
    return aggregate;
};

const doCommandAggregateRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    context: CommandContext
): void => {
    if (!commandAggregateRules || commandAggregateRules.length === 0) {
        return;
    }

    context.logger.localDiagnostic('running command aggregate rules:');
    for (let i = 0; i < commandAggregateRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const commandAggregateRule = commandAggregateRules[i];
        const commandAggregateRuleErrors = commandAggregateRule(command, aggregate);
        if (commandAggregateRuleErrors.length > 0) {
            throw new CommandAggregateRuleError('ERROR: Command Aggregate Rule Failed', commandAggregateRuleErrors);
        }
    }
};

const raiseEvents = async <C extends Command>(
    command: C,
    aggregateName: string,
    commandEvents: CommandEvent[],
    context: CommandContext
): Promise<void> => {
    context.logger.localDiagnosticWithObjects('events to raise:', commandEvents);
    const domainEvents: DomainEvent<string>[] = commandEvents.map(
        (x): DomainEvent<string> => ({
            id: context.generateUuid(),
            type: x.type,
            //kind: DomainEventKind.Create,
            aggregateId: x.id,
            data: x.data,
            meta: {
                correlationId: '', // TODO
            },
        })
    );
    await context.eventStream.addEvents(aggregateName, command.id, domainEvents);
    context.logger.localDiagnosticWithObjects('raising domainEvents:', domainEvents);
};

export const handleCreateCommand = async <C extends Command, A extends Aggregate>(
    aggregateName: string,
    command: C,
    handle: HandleCreateCommand<C>,
    validator: ValidateCommand<C>,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command rules
    doCommandRules(command, commandRules, context);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, context);

    //-- handle command
    context.logger.localDiagnostic('handle command');
    const commandEvents = handle(command, metadata, context);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, context);

    context.logger.localDiagnostic('========================================================================');
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
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command rules
    doCommandRules(command, commandRules, context);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, context);

    //-- load aggregate
    const aggregate: A = await loadAggregate(command, aggregateName, evolvers, context);
    if (!aggregate) {
        throw new AggregateLoadError('ERROR: Aggregate not found');
    }

    //-- command aggregate rules
    doCommandAggregateRules(command, aggregate, commandAggregateRules, context);

    //-- handle command
    context.logger.localDiagnostic('handle command');
    const commandEvents = handle(command, aggregate, metadata, context);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, context);

    context.logger.localDiagnostic('========================================================================');
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
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command rules
    doCommandRules(command, commandRules, context);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, context);

    //-- load aggregate
    const aggregate: A | undefined = await tryLoadAggregate(command, aggregateName, evolvers, context);
    if (aggregate) {
        //-- command aggregate rules
        doCommandAggregateRules(command, aggregate, commandAggregateRules, context);
    }

    //-- handle command
    context.logger.localDiagnostic('handle command');
    const commandEvents = handle(command, aggregate, metadata, context);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, context);

    context.logger.localDiagnostic('========================================================================');
};
