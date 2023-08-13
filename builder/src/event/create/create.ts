import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentInProjectRoot } from '@root/common';
import { ensureFolderExists } from '@root/common/ensureFolderExists';

export const loadTemplate = (loadFrom: string, relativePath: string): string => {
    const finalPath = path.join(loadFrom, relativePath);
    return fs.readFileSync(finalPath, 'utf-8');
};

export const addToSubCommand_create = (command: commander.Command): void => {
    command
        .command('create')
        .description('create a new command event')
        .argument('<event>', 'event name')
        .argument('<command>', 'command raising event')
        .argument('<aggregate>', 'aggregate of command raising event')
        .action((event, command, aggregate, options) => {
            ensureCurrentInProjectRoot();
            ensureFolderExists('TBD');

            const outputFolder = path.join(
                process.env.PWD,
                `src/domain/${voca.camelCase(aggregate)}/${voca.camelCase(command)}`
            );

            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(event)}_v1.build.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/build.ts.ejs`), {
                    functionName: `build${voca.titleCase(event)}V1`,
                    eventDataTypeName: `${voca.titleCase(event)}Data_V1`,
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventFilename: `${voca.titleCase(event)}_V1.event`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`
                })
            );

            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(event)}_V1.event.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/event.ts.ejs`), {
                    eventDataTypeName: `${voca.titleCase(event)}Data_V1`,
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`
                })
            );

            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(event)}_V1.evolve.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/evolve.ts.ejs`), {
                    aggregateName: `${voca.titleCase(aggregate)}`,
                    aggregateFileName: `${voca.titleCase(aggregate)}`,
                    isFunctionName: `is${voca.titleCase(event)}_V1`,
                    isFunctionFileName: `${voca.titleCase(event)}_V1.is`,
                    evolveFunctionName: `evolve${voca.titleCase(event)}_V1`,
                })
            );

            fs.writeFileSync(
                `${outputFolder}/${voca.titleCase(event)}_V1.is.ts`,
                ejs.render(loadTemplate(__dirname, `./templates/is.ts.ejs`), {
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventFilename: `${voca.titleCase(event)}_V1.event`,
                    isFunctionName: `is${voca.titleCase(event)}_V1`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`
                })
            );
        });
};
