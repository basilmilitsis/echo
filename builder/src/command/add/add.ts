import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentlyInProjectRoot, ensureFolderDoesNotExist, loadTemplate } from '@root/common';

export const addToSubCommand_create = (command: commander.Command): void => {
    command
        .command('add')
        .description('add a new command')
        .argument('<type>', 'type of command (create | update)') 
        .argument('<command>', 'command name')
        .argument('<aggregate>', 'aggregate of command')
        .action((typeName, commandName, aggregateName, options) => {
            
            if(typeName !== 'create' && typeName !== 'update') {
                throw new Error('type must be create or update');
            }
            
            ensureCurrentlyInProjectRoot();

            const outputFolder = path.join(
                process.env.PWD,
                `src/domain/${voca.camelCase(aggregateName)}/${voca.camelCase(commandName)}`
            );
            ensureFolderDoesNotExist(outputFolder);

            fs.mkdirSync(outputFolder);
            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(commandName)}.${typeName}.command.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/command.ts.ejs`), {
                    interfaceName: voca.titleCase(commandName),
                })
            );
            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(commandName)}.handle.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/handle-${typeName}.ts.ejs`), {
                    functionName: `handle${voca.titleCase(commandName)}`,
                    commandTypeName: voca.titleCase(commandName),
                    commandFileName: `${voca.titleCase(commandName)}.command`,
                    aggregateTypeName: voca.titleCase(aggregateName),
                    aggregateFileName: voca.titleCase(aggregateName),
                })
            );
        });
};
