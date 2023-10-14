import * as voca from 'voca';
import { AggregateInfo, CommandInfo } from '@root/api/common';
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
        const commandPath = '';
        // TODO: is this needed?
        // const commandPath =
        //     command.commandKind === 'create'
        //         ? PathTo.createCommandFile('??', aggregateName, command.commandName)
        //         : PathTo.updateCommandFile('??', aggregateName, command.commandName); // TODO: refactor
        return {
            apiName: voca.camelCase(command.commandName),
            apiMethod: command.commandKind === 'create' ? 'post' : 'put',
            operationId: voca.camelCase(command.commandName),
            input: operationToJsonString(voca.titleCase(command.commandName), commandPath, './tsconfig.json'),
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
