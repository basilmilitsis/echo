import {
    Aggregate,
    Command,
    ValidateCommand,
    CommandContext,
    CommandMetadata,
    HandleUpsertCommand,
    EvaluateCommandAuthRule,
    EvaluateCommandRule,
    EvaluateUpsertAggregateAuthRule,
    EvaluateUpsertAggregateRule,
    EvaluateIndexRule,
} from './types';
import {
    evaluateUpsertAggregateAuthRules,
    evaluateUpsertAggregateRules,
    evaluateCommandAuthRules,
    evaluateIndexRules,
    evaluateCommandRules,
    evaluateValidation,
    raiseEvents,
    tryLoadAggregate,
} from './commandPipelineSteps';
import { EvolverSetsForAggregate } from './commandPipelineSteps/evolve';

export type RunUpsertCommandInput<C extends Command, A extends Aggregate> = {
    aggregateName: string;
    command: C;
    evolvers: EvolverSetsForAggregate<A>;
    handle: HandleUpsertCommand<C, A>;
    validator: ValidateCommand<C>;
    commandAuthRules: EvaluateCommandAuthRule<C>[] | undefined;
    commandRules: EvaluateCommandRule<C>[] | undefined;
    indexRules: EvaluateIndexRule<C>[] | undefined;
    aggregateAuthRules: EvaluateUpsertAggregateAuthRule<C, A>[] | undefined;
    aggregateRules: EvaluateUpsertAggregateRule<C, A>[] | undefined;
    context: CommandContext;
    metadata: CommandMetadata;
};

export const runUpsertCommand = async <C extends Command, A extends Aggregate>(input: RunUpsertCommandInput<C, A>) => {
    input.context.logger.localDiagnostic('========================================================================');

    //-- validator
    evaluateValidation(input.command, input.validator, input.context);

    //-- command auth rules
    evaluateCommandAuthRules(input.command, input.commandAuthRules, input.metadata, input.context);

    //-- command rules
    evaluateCommandRules(input.command, input.commandRules, input.context);

    //-- load aggregate
    const aggregate: A | undefined = await tryLoadAggregate(
        input.command,
        input.aggregateName,
        input.evolvers,
        input.context
    );
    if (aggregate) {
        //-- command aggregate auth rules
        evaluateUpsertAggregateAuthRules(
            input.command,
            aggregate,
            input.aggregateAuthRules,
            input.metadata,
            input.context
        );

        //-- command aggregate rules
        evaluateUpsertAggregateRules(input.command, aggregate, input.aggregateRules, input.context);
    }

    //-- command index rules
    await evaluateIndexRules(input.command, input.indexRules, input.context);

    //-- handle command
    input.context.logger.localDiagnostic('handle command');
    const commandEvents = input.handle(input.command, aggregate, input.metadata, input.context);

    //-- raise events
    await raiseEvents(input.command, input.aggregateName, commandEvents, input.context);

    input.context.logger.localDiagnostic('========================================================================');
};
