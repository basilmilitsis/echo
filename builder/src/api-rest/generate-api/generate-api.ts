import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentlyInProjectRoot, listFoldersIn, loadTemplate, PathTo, determineCommandKind } from '@root/common';

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

export const addToSubCommand_generateApi = (command: commander.Command): void => {
    command
        .command('generate-api')
        .description('generate domain file(s)')
        .action((options) => {
            ensureCurrentlyInProjectRoot();

            const commandImports: CommandImportModel[] = [];
            const operationImports: OperationsImportModel[] = [];
            const operationHandlers: OperationHandlerModel[] = [];
            
            const aggregates = listFoldersIn(PathTo.domainFolder());
            aggregates.forEach((aggregate) => {
                const commands = listFoldersIn(PathTo.aggregateFolder(aggregate)).filter((x) => !x.startsWith('_'));

                commands.forEach((command) => {
                    commandImports.push({
                        aggregateFolder: voca.camelCase(aggregate),
                        commandType: voca.titleCase(command),
                        commandFolder: voca.camelCase(command),
                        commandFile: `${voca.titleCase(command)}.${determineCommandKind(aggregate, command)}.command`,
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

            const outputFolder = path.join(process.env.PWD, `${PathTo.srcFolder()}/_generated`);
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }

            //-- create template model
            const model = {
                commandImports: commandImports,
                operationImports: operationImports,
                operationHandlers: operationHandlers,
            };

            //-- render template
            fs.writeFileSync(
                `${outputFolder}/restAPI.generated.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/restAPI.generated.ts.ejs`), model)
            );
        });
};
