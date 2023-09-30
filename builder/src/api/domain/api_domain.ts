import * as voca from 'voca';
import commander from 'commander';
import { introspectAggregate, PathRules, PathTo, Template, determineCommandKind, listFoldersIn } from '@root/common';
import { buildModel_eventBuild } from './templates/add-event/build';
import { buildModel_event } from './templates/add-event/event';
import { buildModel_eventIs } from './templates/add-event/is';
import { buildModel_evolveCreateEvent } from './templates/add-event/evolve-create';
import { buildModel_evolveUpdateEvent } from './templates/add-event/evolve-update';
import { buildModel_operations } from './templates/generate/operations';
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
        const outputFolder = PathTo.aggregateFolder(process.env.PWD, aggregateName);

        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.aggregateFile(process.env.PWD, aggregateName),
            Template.templatePath(__dirname, './templates/add-aggregate/aggregate.ts.ejs'),
            buildModel_aggregate(aggregateName)
        );
    });

api_domain
    .command('add-create-command')
    .argument('aggregateName')
    .argument('commandName')
    .action((aggregateName, commandName) => {
        const outputFolder = PathTo.commandFolder(process.env.PWD, aggregateName, commandName);
        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.createCommandFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, './templates/add-command/command.ts.ejs'),
            buildModel_command(commandName)
        );
        Template.write(
            PathTo.commandHandleFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/handle-create.ts.ejs`),
            buildModel_handleCreate(commandName)
        );
        Template.write(
            PathTo.validatorFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/validate.ts.ejs`),
            buildModel_validate(commandName, 'create')
        );

        Template.makeFolder(PathTo.commandRulesFolder(process.env.PWD, aggregateName, commandName));
        Template.makeFile(PathTo.commandRulesGitkeep(process.env.PWD, aggregateName, commandName));

        Template.makeFolder(PathTo.indexRulesFolder(process.env.PWD, aggregateName, commandName));
        Template.makeFile(PathTo.indexRulesGitkeep(process.env.PWD, aggregateName, commandName));
    });

api_domain
    .command('add-update-command')
    .argument('aggregateName')
    .argument('commandName')
    .action((aggregateName, commandName) => {
        const outputFolder = PathTo.commandFolder(process.env.PWD, aggregateName, commandName);
        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.updateCommandFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, './templates/add-command/command.ts.ejs'),
            buildModel_command(commandName)
        );
        Template.write(
            PathTo.commandHandleFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/handle-update.ts.ejs`),
            buildModel_handleUpdate(commandName, aggregateName)
        );
        Template.write(
            PathTo.validatorFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/validate.ts.ejs`),
            buildModel_validate(commandName, 'update')
        );

        Template.makeFolder(PathTo.commandRulesFolder(process.env.PWD, aggregateName, commandName));
        Template.makeFile(PathTo.commandRulesGitkeep(process.env.PWD, aggregateName, commandName));

        Template.makeFolder(PathTo.indexRulesFolder(process.env.PWD, aggregateName, commandName));
        Template.makeFile(PathTo.indexRulesGitkeep(process.env.PWD, aggregateName, commandName));

        Template.makeFolder(PathTo.aggregateRulesFolder(process.env.PWD, aggregateName, commandName));
        Template.makeFile(PathTo.aggregateRulesGitkeep(process.env.PWD, aggregateName, commandName));
    });

api_domain
    .command('add-event')
    .argument('aggregateName')
    .argument('commandName')
    .argument('eventName')
    .action((aggregateName, commandName, eventName) => {
        const outputFolder = PathTo.commandFolder(process.env.PWD, aggregateName, commandName);
        const buildFilePath = PathTo.eventBuildFile(process.env.PWD, aggregateName, commandName, eventName);
        const eventFilePath = PathTo.eventFile(process.env.PWD, aggregateName, commandName, eventName);
        const evolveFilePath = PathTo.eventEvolveFile(process.env.PWD, aggregateName, commandName, eventName);
        const isFilePath = PathTo.eventIsFile(process.env.PWD, aggregateName, commandName, eventName);

        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderExists(outputFolder);
        PathRules.ensureFileDoesNotExist(buildFilePath);
        PathRules.ensureFileDoesNotExist(eventFilePath);
        PathRules.ensureFileDoesNotExist(evolveFilePath);
        PathRules.ensureFileDoesNotExist(isFilePath);

        Template.write(
            buildFilePath,
            Template.templatePath(__dirname, './templates/add-event/build.ts.ejs'),
            buildModel_eventBuild(eventName)
        );
        Template.write(
            eventFilePath,
            Template.templatePath(__dirname, './templates/add-event/event.ts.ejs'),
            buildModel_event(eventName)
        );
        if (determineCommandKind(process.env.PWD, aggregateName, commandName) === 'create') {
            Template.write(
                evolveFilePath,
                Template.templatePath(__dirname, `./templates/add-event/evolve-create.ts.ejs`),
                buildModel_evolveCreateEvent(aggregateName, eventName)
            );
        } else {
            Template.write(
                evolveFilePath,
                Template.templatePath(__dirname, `./templates/add-event/evolve-update.ts.ejs`),
                buildModel_evolveUpdateEvent(aggregateName, eventName)
            );
        }
        Template.write(
            isFilePath,
            Template.templatePath(__dirname, './templates/add-event/is.ts.ejs'),
            buildModel_eventIs(eventName)
        );
    });

api_domain
    .command('add-command-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        const outputFolder = PathTo.commandRuleFolder(process.env.PWD, aggregateName, commandName, ruleName);

        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderExists(PathTo.commandRulesFolder(process.env.PWD, aggregateName, commandName));
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.commandRuleFile(process.env.PWD, aggregateName, commandName, ruleName),
            Template.templatePath(__dirname, './templates/add-command-rule/commandRule.ts.ejs'),
            buildModel_commandRule(
                commandName,
                determineCommandKind(process.env.PWD, aggregateName, commandName),
                ruleName
            )
        );
    });

api_domain
    .command('add-index-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        const outputFolder = PathTo.indexRuleFolder(process.env.PWD, aggregateName, commandName, ruleName);

        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderExists(PathTo.indexRulesFolder(process.env.PWD, aggregateName, commandName));
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.indexRuleFile(process.env.PWD, aggregateName, commandName, ruleName),
            Template.templatePath(__dirname, './templates/add-index-rule/indexRule.ts.ejs'),
            buildModel_indexRule(
                commandName,
                determineCommandKind(process.env.PWD, aggregateName, commandName),
                ruleName
            )
        );
    });

api_domain
    .command('add-aggregate-rule')
    .argument('aggregateName')
    .argument('commandName')
    .argument('ruleName')
    .action((aggregateName, commandName, ruleName) => {
        const outputFolder = PathTo.aggregateRuleFolder(process.env.PWD, aggregateName, commandName, ruleName);

        const commandKind = determineCommandKind(process.env.PWD, aggregateName, commandName);
        if (commandKind === 'create') {
            throw new Error('Crete commands cannot have an Aggregate Rule');
        }

        PathRules.ensureCurrentlyInProjectRoot();
        PathRules.ensureFolderExists(PathTo.aggregateRulesFolder(process.env.PWD, aggregateName, commandName));
        PathRules.ensureFolderDoesNotExist(outputFolder);

        Template.makeFolder(outputFolder);
        Template.write(
            PathTo.aggregateRuleFile(process.env.PWD, aggregateName, commandName, ruleName),
            Template.templatePath(__dirname, './templates/add-aggregate-rule/aggregateRule.ts.ejs'),
            buildModel_aggregateRule(aggregateName, commandName, commandKind, ruleName)
        );
    });

api_domain.command('generate').action(() => {
    PathRules.ensureCurrentlyInProjectRoot();

    const aggregateFolderNames = listFoldersIn(PathTo.domainFolder(process.env.PWD));
    aggregateFolderNames.forEach((aggregateFolderName) => {
        const outputFolder = PathTo.generatedFolder(process.env.PWD);
        // if (!fs.existsSync(outputFolder)) {
        //     fs.mkdirSync(outputFolder);
        // }

        const introspectedAggregate = introspectAggregate(process.env.PWD, aggregateFolderName);
        //Template.makeFolder(outputFolder);
        Template.write(
            PathTo.operationsFile(process.env.PWD, aggregateFolderName),
            Template.templatePath(__dirname, './templates/generate/operations.ts.ejs'),
            buildModel_operations(introspectedAggregate)
        );
    });
});
