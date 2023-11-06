import { CommandAggregateAuthRuleError } from '../errors';
import { Aggregate, Command, EvaluateUpdateAggregateAuthRule, CommandContext, CommandMetadata } from '../types';

export const evaluateUpdateAggregateAuthRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    aggregateAuthRules: EvaluateUpdateAggregateAuthRule<C, A>[] | undefined,
    metadata: CommandMetadata,
    context: CommandContext
): void => {
    if (!aggregateAuthRules || aggregateAuthRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command aggregate auth rules:');
    for (let i = 0; i < aggregateAuthRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = aggregateAuthRules[i];
        const errors = rule(command, aggregate, metadata);
        if (errors.length > 0) {
            throw new CommandAggregateAuthRuleError('ERROR: Command Aggregate Auth Rule Failed', errors);
        }
    }
};
