import {
    Aggregate,
    Command,
    EvaluateCommandAggregateRule,
    EvaluateCommandIndexRule,
    EvaluateCommandRule,
    HandleUpdateCommand,
    ValidateCommand,
    CommandContext,
    CommandMetadata,
    EvaluateCommandAuthRule,
    EvaluateCommandAggregateAuthRule,
} from './types';
import {
    evaluateCommandAggregateAuthRules,
    evaluateCommandAggregateRules,
    evaluateCommandAuthRules,
    evaluateCommandIndexRules,
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
    commandIndexRules: EvaluateCommandIndexRule<C>[] | undefined,
    commandAggregateAuthRules: EvaluateCommandAggregateAuthRule<C, A>[] | undefined,
    commandAggregateRules: EvaluateCommandAggregateRule<C, A>[] | undefined,
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
    evaluateCommandAggregateAuthRules(input.command, aggregate, input.commandAggregateAuthRules, input.metadata, input.context);

    //-- command aggregate rules
    evaluateCommandAggregateRules(input.command, aggregate, input.commandAggregateRules, input.context);

    //-- command index rules
    await evaluateCommandIndexRules(input.command, input.commandIndexRules, input.context);

    //-- handle command
    input.context.logger.localDiagnostic('handle command');
    const commandEvents = input.handle(input.command, aggregate, input.metadata, input.context);

    //-- raise events
    await raiseEvents(input.command, input.aggregateName, commandEvents, input.context);

    input.context.logger.localDiagnostic('========================================================================');
};
