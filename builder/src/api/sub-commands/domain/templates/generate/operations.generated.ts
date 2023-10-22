import { AggregateInfo, EventStructure, FileInfo } from '@root/api/common';

export type RuleFileInfo = {
    functionName: string;
    uniqueFunctionName: string;
    importName: string;
};

type OpeartionCommandModel = {
    commandKind: string;
    commandTypeName: string;

    commandFolderName: string;
    commandFileName: string;

    operationFunctionName: string;

    handleFunctionName: string;
    handleFileName: string;

    validator: FileInfo;

    commandRules: RuleFileInfo[];
    commandRuleFunctionNames: string;

    commandIndexRules: RuleFileInfo[];
    commandIndexRuleFunctionNames: string;

    commandAggregateRules: RuleFileInfo[];
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

const createUniqueFunctionName = (commandName: string, functionName: string): string =>
    `${commandName}_${functionName}`;

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

            validator: {
                functionName: command.validator.functionName,
                importName: command.validator.importName,
            },
            commandRules:
                command.commandRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandRuleFunctionNames:
                command.commandRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',

            commandIndexRules:
                command.commandIndexRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandIndexRuleFunctionNames:
                command.commandIndexRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',

            commandAggregateRules:
                command.commandAggregateRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandAggregateRuleFunctionNames:
                command.commandAggregateRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',
        })),
    };
};
