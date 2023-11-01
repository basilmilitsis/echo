import { CommandRuleError } from '../errors';
import { Command, CommandContext, EvaluateCommandRule } from '../types';

export const evaluateCommandRules = <C extends Command>(
    command: C,
    commandRules: EvaluateCommandRule<C>[] | undefined,
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
