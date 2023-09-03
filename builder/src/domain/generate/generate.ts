import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentlyInProjectRoot, listFilesIn, listFoldersIn, loadTemplate } from '@root/common';
import { CommandStructure, buildCommandStructures } from './buildCommandStructures';
import { PathTo } from './PathTo';
import { EventStructure, buildEventStructures } from './buildEventStructures';

// TODO: refactor and simplify this
export const addToSubCommand_generate = (command: commander.Command): void => {
    command
        .command('generate')
        .description('generate domain file(s)')
        .action((options) => {
            ensureCurrentlyInProjectRoot();

            const aggregates = listFoldersIn(PathTo.domainFolder());
            aggregates.forEach((aggregate) => {

                const outputFolder = path.join(process.env.PWD, `${PathTo.aggregateFolder(aggregate)}/_generated`);
                if (!fs.existsSync(outputFolder)) {
                    fs.mkdirSync(outputFolder);
                }

                //-- Get all command names
                const commands = listFoldersIn(PathTo.aggregateFolder(aggregate)).filter((x) => !x.startsWith('_'));

                //-- extract command structures
                const commandStructures: CommandStructure[] = buildCommandStructures(commands, aggregate);

                //-- extract event structures
                const eventStructures: EventStructure[] = buildEventStructures(commands, aggregate);

                //-- extract evolvers
                const evolversPerCommand = commands.map((c) => ({
                    command: c,
                    evolvers: listFilesIn(PathTo.commandFolder(aggregate, c)).filter((x) => x.endsWith('.event.ts')),
                }));
                const evolverSets = evolversPerCommand.flatMap((x) =>
                    x.evolvers.map((e) => ({ command: x.command, evolver: e.replace('.event.ts', '') }))
                );

                //-- create template model
                const model = {
                    aggregateTypeName: voca.titleCase(aggregate),
                    aggregateFileName: voca.titleCase(aggregate),

                    evolvers: evolverSets.map((evolverSet) => ({
                        evolverFunctionName: `evolve${voca.titleCase(evolverSet.evolver)}`,
                        evolverFileName: `${voca.titleCase(evolverSet.evolver)}.evolve`,
                        command: `${voca.camelCase(evolverSet.command)}`,
                    })),

                    events: eventStructures,

                    commands: commandStructures.map((com) => ({
                        commandType: com.commandType,
                        commandTypeName: voca.titleCase(com.command),
                        commandFileName: `${voca.titleCase(com.command)}.${com.commandType}.command`,
                        handleFunctionName: `handle${voca.titleCase(com.command)}`,
                        handleFileName: `${voca.titleCase(com.command)}.handle`,
                        commandFolderName: `${voca.camelCase(com.command)}`,
                        operationFunctionName: voca.camelCase(com.command),
                        validator: com.validator
                            ? {
                                  functionName: com.validator.functionName,
                                  importName: com.validator.importName,
                              }
                            : undefined,
                        commandRules:
                            com.commandRules.map((x) => ({
                                functionName: x.functionName,
                                importName: x.importName,
                            })) || [],
                        commandRuleFunctionNames: com.commandRules.map((x) => x.functionName).join(',') || '',
                        commandIndexRules:
                            com.commandIndexRules.map((x) => ({
                                functionName: x.functionName,
                                importName: x.importName,
                            })) || [],
                        commandIndexRuleFunctionNames: com.commandIndexRules.map((x) => x.functionName).join(',') || '',
                        commandAggregateRules:
                            com.commandAggregateRules.map((x) => ({
                                functionName: x.functionName,
                                importName: x.importName,
                            })) || [],
                        commandAggregateRuleFunctionNames:
                            com.commandAggregateRules.map((x) => x.functionName).join(',') || '',
                    })),
                };

                //-- render template
                fs.writeFileSync(
                    `${outputFolder}/${voca.titleCase(aggregate)}.operations.ts`,
                    ejs.render(loadTemplate(__dirname, `./templates/operations.ts.ejs`), model)
                );
            });
        });
};
