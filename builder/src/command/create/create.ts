import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentInProjectRoot } from '@root/common';
import { ensureFolderDoesNotExist } from '@root/common/ensureFolderDoesNotExist';

export const loadTemplate = (loadFrom: string, relativePath: string): string => {
    const finalPath = path.join(loadFrom, relativePath);
    return fs.readFileSync(finalPath, 'utf-8');
};

export const addToSubCommand_create = (command: commander.Command): void => {
    command
        .command('create')
        .description('create a new command')
        .argument('<command>', 'command name')
        .argument('<aggregate>', 'aggregate of command')
        .action((name, aggregate, options) => {
            ensureCurrentInProjectRoot();
            ensureFolderDoesNotExist('TBD');

            const outputFolder = path.join(
                process.env.PWD,
                `src/domain/${voca.camelCase(aggregate)}/${voca.camelCase(name)}`
            );

            fs.mkdirSync(outputFolder);
            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(name)}.command.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/command.ts.ejs`), {
                    interfaceName: voca.titleCase(name),
                })
            );
            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(name)}.handle.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/handle.ts.ejs`), {
                    functionName: `handle${voca.titleCase(name)}`,
                    commandTypeName: voca.titleCase(name),
                    commandFileName: `${voca.titleCase(name)}.command`,
                    aggregateTypeName: voca.titleCase(aggregate),
                    aggregateFileName: voca.titleCase(aggregate),
                })
            );
        });
};
