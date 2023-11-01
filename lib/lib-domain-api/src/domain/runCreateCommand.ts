import {
    Command,
    EvaluateCommandIndexRule,
    EvaluateCommandRule,
    HandleCreateCommand,
    ValidateCommand,
    CommandContext,
    CommandMetadata,
    EvaluateCommandAuthRule,
} from './types';
import { evaluateCommandAuthRules, evaluateCommandIndexRules, evaluateCommandRules, evaluateValidation, raiseEvents } from './commandPipelineSteps';

export type RunCreateCommandInput<C extends Command> = {
    aggregateName: string,
    command: C,
    handle: HandleCreateCommand<C>,
    validator: ValidateCommand<C>,
    commandAuthRules: EvaluateCommandAuthRule<C>[] | undefined,
    commandRules: EvaluateCommandRule<C>[] | undefined,
    commandIndexRules: EvaluateCommandIndexRule<C>[] | undefined,
    context: CommandContext,
    metadata: CommandMetadata
};


export const runCreateCommand = async <C extends Command>(
    input: RunCreateCommandInput<C>
) => {
    input.context.logger.localDiagnostic('========================================================================');

    //-- validator
    evaluateValidation(input.command, input.validator, input.context);

    //-- command auth rules
    evaluateCommandAuthRules(input.command, input.commandAuthRules, input.metadata, input.context);

    //-- command rules
    evaluateCommandRules(input.command, input.commandRules, input.context);

    //-- command index rules
    await evaluateCommandIndexRules(input.command, input.commandIndexRules, input.context);

    //-- handle command
    input.context.logger.localDiagnostic('handle command');
    const commandEvents = input.handle(input.command, input.metadata, input.context);

    //-- raise events
    await raiseEvents(input.command, input.aggregateName, commandEvents, input.context);

    input.context.logger.localDiagnostic('========================================================================');
};
