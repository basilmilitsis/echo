import { AggregateInfo, EventStructure, FileInfo } from '@root/api/common';

type OpeartionCommandModel = {
    commandKind: string;
    commandTypeName: string;

    commandFolderName: string;
    commandFileName: string;

    operationFunctionName: string;

    handleFunctionName: string;
    handleFileName: string;

    validator: FileInfo;

    commandRules: FileInfo[];
    commandRuleFunctionNames: string;

    commandIndexRules: FileInfo[];
    commandIndexRuleFunctionNames: string;

    commandAggregateRules: FileInfo[];
    commandAggregateRuleFunctionNames: string;
};
type OperationEvolverModel = {
    evolverFunctionName: string;
    evolverFileName: string;
    command: string;
};
type OperationsModel = {
    aggregateTypeName: string;
    aggregateFileName: string;
    aggregateFolder: string;

    evolvers: OperationEvolverModel[];
    events: EventStructure[];
    commands: OpeartionCommandModel[];
};

export const buildModel_operations = (aggregateInfo: AggregateInfo): OperationsModel => {
    return {
        aggregateTypeName: aggregateInfo.aggregateTypeName,
        aggregateFileName: aggregateInfo.aggregateFileName,
        aggregateFolder: aggregateInfo.aggregateFolder,

        events: aggregateInfo.commands.map((command) => command.events).flat(),

        evolvers: aggregateInfo.commands
            .map((command) => {
                return command.events.map((event) => ({
                    evolverFunctionName: event.evolveFunction,
                    evolverFileName: event.evolveFilename,
                    command: command.commandName,
                }));
            })
            .flat(),

        commands: aggregateInfo.commands.map((command) => ({
            commandKind: command.commandKind,
            commandTypeName: command.commandTypeName,
            commandFolderName: command.commandFolderName,
            commandFileName: command.commandFileName,

            operationFunctionName: command.commandFolderName, // TODO:

            handleFunctionName: command.handle.functionName,
            handleFileName: command.handle.importName,

            validator: command.validator
                ? {
                      functionName: command.validator.functionName,
                      importName: command.validator.importName,
                  }
                : undefined,
            commandRules:
                command.commandRules.map((x) => ({
                    functionName: x.functionName,
                    importName: x.importName,
                })) || [],
            commandRuleFunctionNames: command.commandRules.map((x) => x.functionName).join(',') || '',

            commandIndexRules:
                command.commandIndexRules.map((x) => ({
                    functionName: x.functionName,
                    importName: x.importName,
                })) || [],
            commandIndexRuleFunctionNames: command.commandIndexRules.map((x) => x.functionName).join(',') || '',

            commandAggregateRules:
                command.commandAggregateRules.map((x) => ({
                    functionName: x.functionName,
                    importName: x.importName,
                })) || [],
            commandAggregateRuleFunctionNames: command.commandAggregateRules.map((x) => x.functionName).join(',') || '',
        })),
    };
};
