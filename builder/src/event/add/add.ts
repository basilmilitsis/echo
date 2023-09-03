import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import {
    detectCreateOrUpdateCommand,
    ensureCurrentlyInProjectRoot,
    ensureFolderExists,
    loadTemplate,
} from '@root/common';
import { ensureFileDoesNotExist } from '@root/common/ensureFileDoesNotExist';
import { PathTo } from '@root/domain/generate/PathTo';

export const addToSubCommand_create = (command: commander.Command): void => {
    command
        .command('add')
        .description('add a new command event')
        .argument('<event>', 'event name')
        .argument('<command>', 'command raising event')
        .argument('<aggregate>', 'aggregate of command raising event')
        .action((event, command, aggregate, options) => {
            ensureCurrentlyInProjectRoot();

            const outputFolder = path.join(
                process.env.PWD,
                `src/domain/${voca.camelCase(aggregate)}/${voca.camelCase(command)}`
            );
            ensureFolderExists(outputFolder);

            const commandKind = detectCreateOrUpdateCommand(PathTo.commandFolder(aggregate, command), command);

            const buildFilePath = `${outputFolder}/${voca.titleCase(event)}_V1.build.ts`;
            ensureFileDoesNotExist(buildFilePath);
            const eventFilePath = `${outputFolder}/${voca.titleCase(event)}_V1.event.ts`;
            ensureFileDoesNotExist(eventFilePath);
            const evolveFilePath = `${outputFolder}/${voca.titleCase(event)}_V1.evolve.ts`;
            ensureFileDoesNotExist(evolveFilePath);
            const isFilePath = `${outputFolder}/${voca.titleCase(event)}_V1.is.ts`;
            ensureFileDoesNotExist(isFilePath);

            fs.writeFileSync(
                buildFilePath,
                ejs.render(loadTemplate(__dirname, `./templates/build.ts.ejs`), {
                    functionName: `build${voca.titleCase(event)}V1`,
                    eventDataTypeName: `${voca.titleCase(event)}Data_V1`,
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventFilename: `${voca.titleCase(event)}_V1.event`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`,
                })
            );

            fs.writeFileSync(
                eventFilePath,
                ejs.render(loadTemplate(__dirname, `./templates/event.ts.ejs`), {
                    eventDataTypeName: `${voca.titleCase(event)}Data_V1`,
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`,
                })
            );

            fs.writeFileSync(
                evolveFilePath,
                ejs.render(loadTemplate(__dirname, `./templates/evolve-${commandKind}.ts.ejs`), {
                    aggregateName: `${voca.titleCase(aggregate)}`,
                    aggregateFileName: `${voca.titleCase(aggregate)}`,
                    isFunctionName: `is${voca.titleCase(event)}_V1`,
                    isFunctionFileName: `${voca.titleCase(event)}_V1.is`,
                    evolveFunctionName: `evolve${voca.titleCase(event)}_V1`,
                })
            );

            fs.writeFileSync(
                isFilePath,
                ejs.render(loadTemplate(__dirname, `./templates/is.ts.ejs`), {
                    eventTypeName: `${voca.titleCase(event)}_V1`,
                    eventFilename: `${voca.titleCase(event)}_V1.event`,
                    isFunctionName: `is${voca.titleCase(event)}_V1`,
                    eventEnumFieldName: `${voca.titleCase(event)}_V1`,
                })
            );
        });
};
