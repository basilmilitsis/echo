import * as voca from 'voca';
import { AggregateInfo, EventStructure, FileInfo } from '@root/api/common';

export type RuleFileInfo = {
    functionName: string;
    uniqueFunctionName: string;
    importName: string;
};

type OperationCommandModel = {
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

    indexRules: RuleFileInfo[];
    commandIndexRuleFunctionNames: string;

    aggregateRules: RuleFileInfo[];
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
    aggregateStreamName: string;

    evolvers: OperationEvolverModel[];
    events: EventStructure[];
    commands: OperationCommandModel[];
};

const createUniqueFunctionName = (commandName: string, functionName: string): string =>
    `${commandName}_${functionName}`;

export const buildModel_operations = (aggregateInfo: AggregateInfo): OperationsModel => {
    return {
        aggregateTypeName: aggregateInfo.aggregateTypeName,
        aggregateFileName: aggregateInfo.aggregateFileName,
        aggregateFolder: aggregateInfo.aggregateFolder,
        aggregateStreamName: voca.camelCase(aggregateInfo.aggregateTypeName),

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

            commandAuthRules:
            command.commandAuthRules.map((x) => ({
                functionName: x.functionName,
                uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                importName: x.importName,
            })) || [],
            commandAuthRuleFunctionNames:
            command.commandAuthRules
                .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                .join(',') || '',

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

            indexRules:
                command.indexRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandIndexRuleFunctionNames:
                command.indexRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',

            aggregateAuthRules:
                command.aggregateAuthRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandAggregateAuthRuleFunctionNames:
                command.aggregateAuthRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',
                    
            aggregateRules:
                command.aggregateRules.map((x) => ({
                    functionName: x.functionName,
                    uniqueFunctionName: createUniqueFunctionName(command.commandName, x.functionName),
                    importName: x.importName,
                })) || [],
            commandAggregateRuleFunctionNames:
                command.aggregateRules
                    .map((x) => createUniqueFunctionName(command.commandName, x.functionName))
                    .join(',') || '',
        })),
    };
};
