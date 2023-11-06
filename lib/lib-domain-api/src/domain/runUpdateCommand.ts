import {
    Aggregate,
    Command,
    CommandContext,
    CommandMetadata,
    ValidateCommand,
    HandleUpdateCommand,
    EvaluateCommandAuthRule,
    EvaluateCommandRule,
    EvaluateUpdateAggregateAuthRule,
    EvaluateUpdateAggregateRule,
    EvaluateIndexRule,
} from './types';
import {
    evaluateUpdateAggregateAuthRules,
    evaluateUpdateAggregateRules,
    evaluateCommandAuthRules,
    evaluateIndexRules,
    evaluateCommandRules,
    evaluateValidation,
    loadAggregate,
    raiseEvents,
} from './commandPipelineSteps';
import { AggregateLoadError } from './errors';
import { EvolverSetsForAggregate } from './commandPipelineSteps/evolve';

export type RunUpdateCommandInput<C extends Command, A extends Aggregate> = {
    aggregateName: string,
    command: C,
    evolvers: EvolverSetsForAggregate<A>,
    handle: HandleUpdateCommand<C, A>,
    validator: ValidateCommand<C>,
    commandAuthRules: EvaluateCommandAuthRule<C>[] | undefined,
    commandRules: EvaluateCommandRule<C>[] | undefined,
    indexRules: EvaluateIndexRule<C>[] | undefined,
    aggregateAuthRules: EvaluateUpdateAggregateAuthRule<C, A>[] | undefined,
    aggregateRules: EvaluateUpdateAggregateRule<C, A>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata
}

export const runUpdateCommand = async <C extends Command, A extends Aggregate>(input: RunUpdateCommandInput<C, A>) => {
    input.context.logger.localDiagnostic('========================================================================');

    //-- validator
    evaluateValidation(input.command, input.validator, input.context);

    //-- command auth rules
    evaluateCommandAuthRules(input.command, input.commandAuthRules, input.metadata, input.context);

    //-- command rules
    evaluateCommandRules(input.command, input.commandRules, input.context);

    //-- load aggregate
    const aggregate: A = await loadAggregate(input.command, input.aggregateName, input.evolvers, input.context);
    if (!aggregate) {
        throw new AggregateLoadError('ERROR: Aggregate not found');
    }

    //-- command aggregate auth rules
    evaluateUpdateAggregateAuthRules(input.command, aggregate, input.aggregateAuthRules, input.metadata, input.context);

    //-- command aggregate rules
    evaluateUpdateAggregateRules(input.command, aggregate, input.aggregateRules, input.context);

    //-- command index rules
    await evaluateIndexRules(input.command, input.indexRules, input.context);

    //-- handle command
    input.context.logger.localDiagnostic('handle command');
    const commandEvents = input.handle(input.command, aggregate, input.metadata, input.context);

    //-- raise events
    await raiseEvents(input.command, input.aggregateName, commandEvents, input.context);

    input.context.logger.localDiagnostic('========================================================================');
};
