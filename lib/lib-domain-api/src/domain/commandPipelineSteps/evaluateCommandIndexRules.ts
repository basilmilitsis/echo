import { CommandIndexRuleError } from "../errors";
import { Command, CommandContext, EvaluateCommandIndexRule } from "../types";

export const evaluateCommandIndexRules = async <C extends Command>(
    command: C,
    commandIndexRules: EvaluateCommandIndexRule<C>[] | undefined,
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