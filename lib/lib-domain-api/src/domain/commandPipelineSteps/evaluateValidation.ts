import { ValidationError } from "../errors";
import { Command, CommandContext, ValidateCommand } from "../types";

export const evaluateValidation = <C extends Command>(command: C, validator: ValidateCommand<C>, context: CommandContext): void => {
    context.logger.localDiagnostic('running validator...');
    const validationErrors = validator(command);
    if (validationErrors.length > 0) {
        throw new ValidationError('ERROR: Validation Failed', validationErrors);
    }
};
