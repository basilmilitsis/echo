import {
    AggregateLoadError,
    CommandAggregateAuthRuleError,
    CommandAggregateRuleError,
    CommandAuthRuleError,
    CommandIndexRuleError,
    CommandRuleError,
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
    CommandAuthRule,
    CommandAggregateAuthRule,
} from './types';

const doValidation = <C extends Command>(command: C, validator: ValidateCommand<C>, context: CommandContext): void => {
    context.logger.localDiagnostic('running validator...');
    const validationErrors = validator(command);
    if (validationErrors.length > 0) {
        throw new ValidationError('ERROR: Validation Failed', validationErrors);
    }
};

const doCommandAuthRules = <C extends Command>(
    command: C,
    commandAuthRules: CommandAuthRule<C>[] | undefined,
    metadata: CommandMetadata,
    context: CommandContext
): void => {
    if (!commandAuthRules || commandAuthRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command auth rules: ');
    for (let i = 0; i < commandAuthRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = commandAuthRules[i];
        const errors = rule(command, metadata);
        if (errors.length > 0) {
            throw new CommandAuthRuleError('ERROR: Command Auth Rule Failed', errors);
        }
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
        const rule = commandRules[i];
        const errors = rule(command);
        if (errors.length > 0) {
            throw new CommandRuleError('ERROR: Command Rule Failed', errors);
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
        const rule = commandIndexRules[i];
        const errors = await rule(command, context.eventStream);
        if (errors.length > 0) {
            throw new CommandIndexRuleError('ERROR: Command Index Rule Failed', errors);
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

const doCommandAggregateAuthRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateAuthRules: CommandAggregateAuthRule<C, A>[] | undefined,
    metadata: CommandMetadata,
    context: CommandContext
): void => {
    if (!commandAggregateAuthRules || commandAggregateAuthRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command aggregate auth rules:');
    for (let i = 0; i < commandAggregateAuthRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = commandAggregateAuthRules[i];
        const errors = rule(command, aggregate, metadata);
        if (errors.length > 0) {
            throw new CommandAggregateAuthRuleError('ERROR: Command Aggregate Auth Rule Failed', errors);
        }
    }
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
        const rule = commandAggregateRules[i];
        const errors = rule(command, aggregate);
        if (errors.length > 0) {
            throw new CommandAggregateRuleError('ERROR: Command Aggregate Rule Failed', errors);
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
    commandAuthRules: CommandAuthRule<C>[] | undefined,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command auth rules
    doCommandAuthRules(command, commandAuthRules, metadata, context);

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
    commandAuthRules: CommandAuthRule<C>[] | undefined,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    commandAggregateAuthRules: CommandAggregateAuthRule<C, A>[] | undefined,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command auth rules
    doCommandAuthRules(command, commandAuthRules, metadata, context);

    //-- command rules
    doCommandRules(command, commandRules, context);

    //-- load aggregate
    const aggregate: A = await loadAggregate(command, aggregateName, evolvers, context);
    if (!aggregate) {
        throw new AggregateLoadError('ERROR: Aggregate not found');
    }

    //-- command aggregate auth rules
    doCommandAggregateAuthRules(command, aggregate, commandAggregateAuthRules, metadata, context);

    //-- command aggregate rules
    doCommandAggregateRules(command, aggregate, commandAggregateRules, context);

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, context);

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
    commandAuthRules: CommandAuthRule<C>[] | undefined,
    commandRules: CommandRule<C>[] | undefined,
    commandIndexRules: CommandIndexRule<C>[] | undefined,
    commandAggregateAuthRules: CommandAggregateAuthRule<C, A>[] | undefined,
    commandAggregateRules: CommandAggregateRule<C, A>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata,
) => {
    context.logger.localDiagnostic('========================================================================');

    //-- validator
    doValidation(command, validator, context);

    //-- command auth rules
    doCommandAuthRules(command, commandAuthRules, metadata, context);

    //-- command rules
    doCommandRules(command, commandRules, context);

    //-- load aggregate
    const aggregate: A | undefined = await tryLoadAggregate(command, aggregateName, evolvers, context);
    if (aggregate) {
        //-- command aggregate auth rules
        doCommandAggregateAuthRules(command, aggregate, commandAggregateAuthRules, metadata, context);

        //-- command aggregate rules
        doCommandAggregateRules(command, aggregate, commandAggregateRules, context);
    }

    //-- command index rules
    await doCommandIndexRules(command, commandIndexRules, context);

    //-- handle command
    context.logger.localDiagnostic('handle command');
    const commandEvents = handle(command, aggregate, metadata, context);

    //-- raise events
    await raiseEvents(command, aggregateName, commandEvents, context);

    context.logger.localDiagnostic('========================================================================');
};
