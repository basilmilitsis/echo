import commander from 'commander';
import * as voca from 'voca';
import { BuilderEnvironment, PathRules, Writer, listFoldersIn } from '@root/common';
import { PathTo, determineCommandKind, introspectAggregate } from '@root/api/common';
import { buildModel_eventBuild } from './templates/add-event/build';
import { buildModel_event } from './templates/add-event/event';
import { buildModel_eventIs } from './templates/add-event/is';
import { buildModel_evolveCreateEvent } from './templates/add-event/evolve-create';
import { buildModel_evolveUpdateEvent } from './templates/add-event/evolve-update';
import { buildModel_operations } from './templates/generate/operations.generated';
import { buildModel_commandRule } from './templates/add-command-rule/commandRule';
import { buildModel_aggregateRule } from './templates/add-aggregate-rule/aggregateRule';
import { buildModel_indexRule } from './templates/add-index-rule/indexRule';
import { buildModel_aggregate } from './templates/add-aggregate/aggregateRule';
import { buildModel_validate } from './templates/add-command/validate';
import { buildModel_handleUpdate } from './templates/add-command/handle-update';
import { buildModel_handleCreate } from './templates/add-command/handle-create';
import { buildModel_command } from './templates/add-command/command';

export const api_domain = new commander.Command('domain');

api_domain
    .command('add-aggregate')
    .argument('aggregateName')
    .action((aggregateName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        new Writer(BuilderEnvironment.pwd)
            .title('Adding aggregate')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.createFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.createTemplateFile(
                            `${voca.titleCase(aggregateName)}.ts`,
                            `${__dirname}/templates/add-aggregate/aggregate.ts.ejs`,
                            buildModel_aggregate(aggregateName)
                        );
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-create-command')
    .argument('aggregateName')
    .argument('commandName')
    .action((aggregateName, commandName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        new Writer(BuilderEnvironment.pwd)
            .title('Adding create command')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.createFolder(voca.camelCase(commandName), (folder) => {
                            folder
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.create.command.ts`,
                                    `${__dirname}/templates/add-command/command.ts.ejs`,
                                    buildModel_command(commandName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.handle.ts`,
                                    `${__dirname}/templates/add-command/handle-create.ts.ejs`,
                                    buildModel_handleCreate(commandName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.validate.ts`,
                                    `${__dirname}/templates/add-command/validate.ts.ejs`,
                                    buildModel_validate(commandName, 'create')
                                )
                                .ensureFolder('commandRules', (folder) => {
                                    folder.createStringFile('.gitkeep', '');
                                })
                                .ensureFolder('indexRules', (folder) => {
                                    folder.createStringFile('.gitkeep', '');
                                });
                        });
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-update-command')
    .argument('aggregateName')
    .argument('commandName')
    .action((aggregateName, commandName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        new Writer(BuilderEnvironment.pwd)
            .title('Adding update command')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.createFolder(voca.camelCase(commandName), (folder) => {
                            folder
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.update.command.ts`,
                                    `${__dirname}/templates/add-command/command.ts.ejs`,
                                    buildModel_command(commandName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.handle.ts`,
                                    `${__dirname}/templates/add-command/handle-update.ts.ejs`,
                                    buildModel_handleUpdate(commandName, aggregateName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(commandName)}.validate.ts`,
                                    `${__dirname}/templates/add-command/validate.ts.ejs`,
                                    buildModel_validate(commandName, 'update')
                                )
                                .ensureFolder('commandRules', (folder) => {
                                    folder.createStringFile('.gitkeep', '');
                                })
                                .ensureFolder('indexRules', (folder) => {
                                    folder.createStringFile('.gitkeep', '');
                                })
                                .ensureFolder('aggregateRules', (folder) => {
                                    folder.createStringFile('.gitkeep', '');
                                });
                        });
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-event')
    .argument('aggregateName')
    .argument('commandName')
    .argument('eventName')
    .action((aggregateName, commandName, eventName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        const commandKind = determineCommandKind(BuilderEnvironment.pwd, aggregateName, commandName);

        new Writer(BuilderEnvironment.pwd)
            .title('Adding event')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.existingFolder(voca.camelCase(commandName), (folder) => {
                            folder
                                .createTemplateFile(
                                    `${voca.titleCase(eventName)}_V1.build.ts`,
                                    `${__dirname}/templates/add-event/build.ts.ejs`,
                                    buildModel_eventBuild(eventName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(eventName)}_V1.event.ts`,
                                    `${__dirname}/templates/add-event/event.ts.ejs`,
                                    buildModel_event(eventName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(eventName)}_V1.evolve.ts`,
                                    `${__dirname}/templates/add-event/evolve-${commandKind}.ts.ejs`,
                                    commandKind === 'create'
                                        ? buildModel_evolveCreateEvent(aggregateName, eventName)
                                        : buildModel_evolveUpdateEvent(aggregateName, eventName)
                                )
                                .createTemplateFile(
                                    `${voca.titleCase(eventName)}_V1.is.ts`,
                                    `${__dirname}/templates/add-event/is.ts.ejs`,
                                    buildModel_eventIs(eventName)
                                );
                        });
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-command-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        new Writer(BuilderEnvironment.pwd)
            .title('Adding command rule')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.existingFolder(voca.camelCase(commandName), (folder) => {
                            folder.existingFolder('commandRules', (folder) => {
                                folder.createTemplateFile(
                                    `${voca.camelCase(ruleName)}.commandRule.ts`,
                                    `${__dirname}/templates/add-command-rule/commandRule.ts.ejs`,
                                    buildModel_commandRule(
                                        aggregateName,
                                        commandName,
                                        determineCommandKind(BuilderEnvironment.pwd, aggregateName, commandName),
                                        ruleName
                                    )
                                );
                            });
                        });
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-index-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        new Writer(BuilderEnvironment.pwd)
            .title('Adding index rule')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.existingFolder(voca.camelCase(commandName), (folder) => {
                            folder.existingFolder('indexRules', (folder) => {
                                folder.createTemplateFile(
                                    `${voca.camelCase(ruleName)}.indexRule.ts`,
                                    `${__dirname}/templates/add-index-rule/indexRule.ts.ejs`,
                                    buildModel_indexRule(
                                        aggregateName,
                                        commandName,
                                        determineCommandKind(BuilderEnvironment.pwd, aggregateName, commandName),
                                        ruleName
                                    )
                                );
                            });
                        });
                    });
                });
            })
            .close();
    });

api_domain
    .command('add-aggregate-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        PathRules.ensureCurrentlyInProjectRoot();

        const commandKind = determineCommandKind(BuilderEnvironment.pwd, aggregateName, commandName);
        if (commandKind === 'create') {
            throw new Error('Create commands cannot have an Aggregate Rule');
        }

        new Writer(BuilderEnvironment.pwd)
            .title('Adding aggregate rule')
            .existingFolder('src', (folder) => {
                folder.existingFolder('domain', (folder) => {
                    folder.existingFolder(voca.camelCase(aggregateName), (folder) => {
                        folder.existingFolder(voca.camelCase(commandName), (folder) => {
                            folder.existingFolder('aggregateRules', (folder) => {
                                folder.createTemplateFile(
                                    `${voca.camelCase(ruleName)}.aggregateRule.ts`,
                                    `${__dirname}/templates/add-aggregate-rule/aggregateRule.ts.ejs`,
                                    buildModel_aggregateRule(aggregateName, commandName, commandKind, ruleName)
                                );
                            });
                        });
                    });
                });
            })
            .close();
    });

api_domain.command('generate').action(() => {
    PathRules.ensureCurrentlyInProjectRoot();

    const aggregateFolderNames = listFoldersIn(PathTo.domainFolder(BuilderEnvironment.pwd));
    aggregateFolderNames.forEach((aggregateFolderName) => {
        const introspectedAggregate = introspectAggregate(BuilderEnvironment.pwd, aggregateFolderName);
        new Writer(BuilderEnvironment.pwd)
            .title('Generating *.operations.generated.ts (for each aggregate)')
            .ensureFolder('src', (folder) => {
                folder.ensureFolder('_generated', (folder) => {
                    folder.ensureTemplateFile(
                        `${voca.titleCase(aggregateFolderName)}.operations.generated.ts`,
                        `${__dirname}/templates/generate/operations.generated.ts.ejs`,
                        buildModel_operations(introspectedAggregate)
                    );
                });
            })
            .close();
    });
});
