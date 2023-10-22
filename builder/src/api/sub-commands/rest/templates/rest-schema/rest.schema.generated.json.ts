import * as voca from 'voca';
import { AggregateInfo, CommandInfo, PathTo } from '@root/api/common';
import { operationToJsonString } from './operationToJsonString';

type OperationModel = {
    apiName: string;
    apiMethod: string;
    operationId: string;
    input: string;
};
type RestSchemaModel = {
    operations: OperationModel[];
};

const buildAggregateCommandModels = (
    domainRootPath: string,
    aggregateName: string,
    commands: CommandInfo[]
): OperationModel[] => {
    return commands.map((command) => {
        const commandPath =
            command.commandKind === 'create'
                ? PathTo.createCommandFile(domainRootPath, aggregateName, command.commandName)
                : command.commandKind === 'update'
                ? PathTo.updateCommandFile(domainRootPath, aggregateName, command.commandName)
                : PathTo.upsertCommandFile(domainRootPath, aggregateName, command.commandName);

        const commandSchemaAsString = operationToJsonString(
            voca.titleCase(command.commandName),
            commandPath,
            './tsconfig.build.json'
        );
        const commandSchemaAsJson = JSON.parse(commandSchemaAsString);
        return {
            apiName: voca.camelCase(command.commandName),
            apiMethod: command.commandKind === 'create' ? 'post' : 'put',
            operationId: voca.camelCase(command.commandName),
            input: JSON.stringify(commandSchemaAsJson[voca.titleCase(command.commandName)]),
        };
    });
};

export const buildModel_restSchema = (domainRootPath: string, aggregates: AggregateInfo[]): RestSchemaModel => {
    let operationModels: OperationModel[] = [];

    aggregates.forEach((aggregate) => {
        operationModels = operationModels.concat(
            buildAggregateCommandModels(domainRootPath, aggregate.aggregateTypeName, aggregate.commands)
        );
    });

    return {
        operations: operationModels.map((com) => ({
            apiName: com.apiName,
            apiMethod: com.apiMethod,
            operationId: com.operationId,
            input: com.input,
        })),
    };
};
