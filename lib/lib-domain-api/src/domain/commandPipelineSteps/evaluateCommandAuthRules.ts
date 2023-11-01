import { CommandAuthRuleError } from '../errors';
import { Command, EvaluateCommandAuthRule, CommandContext, CommandMetadata } from '../types';

export const evaluateCommandAuthRules = <C extends Command>(
    command: C,
    commandAuthRules: EvaluateCommandAuthRule<C>[] | undefined,
    metadata: CommandMetadata,
    context: CommandContext
): void => {
    if (!commandAuthRules || commandAuthRules.length === 0) {
        return;
    }
    context.logger.localDiagnostic('running command auth rules: ');
    for (let i = 0; i < commandAuthRules.length; i++) {
        context.logger.localDiagnostic(`- rule: ${i}`);
        const rule = commandAuthRules[i];
        const errors = rule(command, metadata);
        if (errors.length > 0) {
            throw new CommandAuthRuleError('ERROR: Command Auth Rule Failed', errors);
        }
    }
};
