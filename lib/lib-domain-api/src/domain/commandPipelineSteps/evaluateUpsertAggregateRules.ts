import { CommandAggregateRuleError } from "../errors";
import { Aggregate, Command, EvaluateUpsertAggregateRule, CommandContext } from "../types";

export const evaluateUpsertAggregateRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    aggregateRules: EvaluateUpsertAggregateRule<C, A>[] | undefined,
    context: CommandContext
): void => {
    if (!aggregateRules || aggregateRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command aggregate rules:');
    for (let i = 0; i < aggregateRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = aggregateRules[i];
        const errors = rule(command, aggregate);
        if (errors.length > 0) {
            throw new CommandAggregateRuleError('ERROR: Command Aggregate Rule Failed', errors);
        }
    }
};