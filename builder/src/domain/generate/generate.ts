import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import * as voca from 'voca';
import commander from 'commander';
import { ensureCurrentlyInProjectRoot, listFilesIn, listFoldersIn, loadTemplate } from '@root/common';

const domainFolder = (): string => `./src/domain`;
const aggregateFolder = (aggregate: string): string => `${domainFolder()}/${voca.camelCase(aggregate)}`;
const commandFolder = (aggregate: string, command: string): string =>
    `${aggregateFolder(aggregate)}/${voca.camelCase(command)}`;

const createCommandFile = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/${voca.titleCase(command)}.create.command.ts`;
const updateCommandFile = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/${voca.titleCase(command)}.update.command.ts`;

const commandRulesFolder = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/commandRules`;
const commandIndexRulesFolder = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/indexRules`;
const commandAggregateRulesFolder = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/aggregateRules`;

const validatorFile = (aggregate: string, command: string): string =>
    `${commandFolder(aggregate, command)}/${voca.titleCase(command)}.validate.ts`;

type CommandFile = {
    functionName: string;
    importName: string;
};
type CommandStructure = {
    command: string;
    commandType: 'create' | 'update';
    validator?: CommandFile;
    commandRules: CommandFile[];
    commandIndexRules: CommandFile[];
    commandAggregateRules: CommandFile[];
    evolvers: string[];
};


// TODO: refactor and simplify this
export const addToSubCommand_generate = (command: commander.Command): void => {
    command
        .command('generate')
        .description('generate domain file(s)')
        .action((options) => {
            ensureCurrentlyInProjectRoot();

            const aggregates = listFoldersIn(domainFolder());
            aggregates.forEach((aggregate) => {
                const outputFolder = path.join(process.env.PWD, `${aggregateFolder(aggregate)}/_generated`);
                if (!fs.existsSync(outputFolder)) {
                    fs.mkdirSync(outputFolder);
                }

                const commands = listFoldersIn(aggregateFolder(aggregate)).filter((x) => !x.startsWith('_'));

                //-- extract command structures
                const commandStructures: CommandStructure[] = [];
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];

                    const isCreateCommand = fs.existsSync(createCommandFile(aggregate, command));
                    const isupdateCommand = fs.existsSync(updateCommandFile(aggregate, command));
                    if (!isCreateCommand && !isupdateCommand) {
                        throw new Error(`Unknown command type for command: ${command}`);
                    }
                    commandStructures.push({
                        command: command,
                        commandType: isCreateCommand ? 'create' : 'update',
                        validator: fs.existsSync(validatorFile(aggregate, command))
                            ? {
                                  functionName: `validate${voca.titleCase(command)}`,
                                  importName: `${voca.titleCase(command)}.validate`,
                              }
                            : undefined,
                        commandRules:
                            listFilesIn(commandRulesFolder(aggregate, command))
                                .filter((x) => x.endsWith('.commandRule.ts'))
                                .map((x) => ({
                                    functionName: x.replace('.commandRule.ts', ''),
                                    importName: x.replace('.ts', ''),
                                })) || [],
                        commandIndexRules:
                            listFilesIn(commandIndexRulesFolder(aggregate, command))
                                .filter((x) => x.endsWith('.indexRule.ts'))
                                .map((x) => ({
                                    functionName: x.replace('.indexRule.ts', ''),
                                    importName: x.replace('.ts', ''),
                                })) || [],
                        commandAggregateRules:
                            listFilesIn(commandAggregateRulesFolder(aggregate, command))
                                .filter((x) => x.endsWith('.aggregateRule.ts'))
                                .map((x) => ({
                                    functionName: x.replace('.aggregateRule.ts', ''),
                                    importName: x.replace('.ts', ''),
                                })) || [],
                        evolvers: listFilesIn(commandFolder(aggregate, command))
                            .filter((x) => x.endsWith('.event.ts'))
                            .map((x) => x.replace('.event.ts', '')),
                    });
                }

                //-- extract evolvers
                const evolversPerCommand = commands.map((c) => ({
                    command: c,
                    evolvers: listFilesIn(commandFolder(aggregate, c)).filter((x) => x.endsWith('.event.ts')),
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
                        commandRuleFunctionNames:
                            com.commandRules
                                .map((x) => x.functionName)
                                .join(',') || '',
                        commandIndexRules:
                            com.commandIndexRules.map((x) => ({
                                functionName: x.functionName,
                                importName: x.importName,
                            })) || [],
                        commandIndexRuleFunctionNames:
                            com.commandIndexRules
                                .map((x) => x.functionName)
                                .join(',') || '',
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
