import { CommandAggregateAuthRuleError } from '../errors';
import { Aggregate, Command, EvaluateCommandAggregateAuthRule, CommandContext, CommandMetadata } from '../types';

export const evaluateCommandAggregateAuthRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateAuthRules: EvaluateCommandAggregateAuthRule<C, A>[] | undefined,
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
