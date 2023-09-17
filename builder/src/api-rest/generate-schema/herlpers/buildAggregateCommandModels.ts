import * as voca from 'voca';
import { PathTo, determineCommandKind } from '@root/common';
import { operationToJsonString } from './operationToJsonString';
import { OperationModel } from './OperationModel';

export const buildAggregateCommandModels = (commands: string[], aggregate: string): OperationModel[] => {
    return commands.map((command) => {
        const commandKind = determineCommandKind(aggregate, command);
        const commandPath =
            commandKind === 'create'
                ? PathTo.createCommandFile(aggregate, command)
                : PathTo.updateCommandFile(aggregate, command); // TODO refactor
        return {
            apiName: voca.camelCase(command),
            apiMethod: commandKind === 'create' ? 'post' : 'put',
            operationId: voca.camelCase(command),
            input: operationToJsonString(voca.titleCase(command), commandPath, './tsconfig.json'),
        };
    });
};
