import { CommandIndexRuleError } from "../errors";
import { Command, CommandContext, EvaluateIndexRule } from "../types";

export const evaluateIndexRules = async <C extends Command>(
    command: C,
    indexRules: EvaluateIndexRule<C>[] | undefined,
    context: CommandContext
): Promise<void> => {
    if (!indexRules || indexRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command index rules:');
    for (let i = 0; i < indexRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = indexRules[i];
        const errors = await rule(command, context.eventStream);
        if (errors.length > 0) {
            throw new CommandIndexRuleError('ERROR: Command Index Rule Failed', errors);
        }
    }
};