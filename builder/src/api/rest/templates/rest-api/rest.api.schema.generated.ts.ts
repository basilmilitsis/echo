import * as voca from 'voca';
import { PathTo, determineCommandKind, listFoldersIn } from '@root/common';

type CommandImportModel = {
    aggregateFolder: string;
    commandType: string;
    commandFolder: string;
    commandFile: string;
};
type OperationsImportModel = {
    operationsFile: string;
    operationFunctions: string[];
};
type OperationHandlerModel = {
    operationId: string;
    commandType: string;
    operationFunctionName: string;
};
type RestApiModel = {
    commandImports: CommandImportModel[];
    operationImports: OperationsImportModel[];
    operationHandlers: OperationHandlerModel[];
};

export const buildModel_restApi = (domainRootPath: string): RestApiModel => {
    const commandImports: CommandImportModel[] = [];
    const operationImports: OperationsImportModel[] = [];
    const operationHandlers: OperationHandlerModel[] = [];

    const aggregates = listFoldersIn(PathTo.domainFolder(domainRootPath));
    aggregates.forEach((aggregate) => {
        const commands = listFoldersIn(PathTo.aggregateFolder(domainRootPath, aggregate)).filter(
            (x) => !x.startsWith('_')
        );

        commands.forEach((command) => {
            commandImports.push({
                aggregateFolder: voca.camelCase(aggregate),
                commandType: voca.titleCase(command),
                commandFolder: voca.camelCase(command),
                commandFile: `${voca.titleCase(command)}.${determineCommandKind(
                    process.env.PWD,
                    aggregate,
                    command
                )}.command`,
            });
            operationHandlers.push({
                operationId: `${voca.camelCase(command)}`,
                commandType: voca.titleCase(command),
                operationFunctionName: voca.camelCase(command),
            });
        });

        operationImports.push({
            operationsFile: `${voca.titleCase(aggregate)}.operations`,
            operationFunctions: commands.map((command) => voca.camelCase(command)),
        });
    });

    return {
        commandImports: commandImports,
        operationImports: operationImports,
        operationHandlers: operationHandlers,
    };
};
