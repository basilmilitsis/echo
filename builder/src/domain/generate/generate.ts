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

const listFolders = (folder: string): string[] => {
    return fs
        .readdirSync(folder, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
};
const listFiles = (folder: string): string[] => {
    return fs
        .readdirSync(folder, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name);
};

export const addToSubCommand_generate = (command: commander.Command): void => {
    command
        .command('generate')
        .description('generate domain file(s)')
        .action((options) => {
            ensureCurrentInProjectRoot();

            const aggregates = listFolders('./src/domain');
            aggregates.forEach((aggregate) => {

                const outputFolder = path.join(process.env.PWD, `src/domain/${voca.camelCase(aggregate)}/_generated`);

                if (!fs.existsSync(outputFolder)) {
                    fs.mkdirSync(outputFolder);
                }
                
                const commands = listFolders(`./src/domain/${voca.camelCase(aggregate)}`).filter((x) => !x.startsWith('_'));

                const evolversPerCommand = commands.map((c) => ({
                    command: c,
                    evolvers: listFiles(`./src/domain/${voca.camelCase(aggregate)}/${voca.camelCase(c)}`).filter((x) => x.endsWith('.event.ts')),
                }));
                const evolverSets = evolversPerCommand.flatMap((x) =>
                    x.evolvers.map((e) => ({ command: x.command, evolver: e.replace('.event.ts','') }))
                );
         
                fs.writeFileSync(
                    `${outputFolder}/${voca.titleCase(aggregate)}.operations.ts`,
                    ejs.render(loadTemplate(__dirname, `./templates/operations.ts.ejs`), {
                        aggregateTypeName: voca.titleCase(aggregate),
                        aggregateFileName: voca.titleCase(aggregate),

                        evolvers: evolverSets.map((evolverSet) => ({
                            evolverFunctionName: `evolve${voca.titleCase(evolverSet.evolver)}`,
                            evolverFileName: `${voca.titleCase(evolverSet.evolver)}.evolve`,
                            command: `${voca.camelCase(evolverSet.command)}`,
                        })),

                        commands: commands.map((command) => ({
                            commandTypeName: voca.titleCase(command),
                            commandFileName: `${voca.titleCase(command)}.command`,
                            handleFunctionName: `handle${voca.titleCase(command)}`,
                            handleFileName: `${voca.titleCase(command)}.handle`,
                            commandFolderName: `${voca.camelCase(command)}`,

                            operationFunctionName: voca.camelCase(command),
                        })),
                    })
                );
            });
        });
};
