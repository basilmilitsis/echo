import { CommandAggregateRuleError } from "../errors";
import { Aggregate, Command, EvaluateCommandAggregateRule, CommandContext } from "../types";

export const evaluateCommandAggregateRules = <C extends Command, A extends Aggregate>(
    command: C,
    aggregate: A,
    commandAggregateRules: EvaluateCommandAggregateRule<C, A>[] | undefined,
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