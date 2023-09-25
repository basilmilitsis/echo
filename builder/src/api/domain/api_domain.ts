import * as voca from 'voca';
import commander from 'commander';
import { introspectAggregate, PathRules, PathTo, Template, determineCommandKind, listFoldersIn } from '@root/common';
import { buildModel_eventBuild } from './templates/add-event/build';
import { buildModel_event } from './templates/add-event/event';
import { buildModel_eventIs } from './templates/add-event/is';
import { buildModel_evolveCreateEvent } from './templates/add-event/evolve-create';
import { buildModel_evolveUpdateEvent } from './templates/add-event/evolve-update';
import { buildModel_operations } from './templates/generate/operations';

export const api_domain = new commander.Command('domain');

api_domain
    .command('add-aggregate')
    .argument('aggregate')
    .action((aggregate) => {
        console.log(`TODO`);
    });

api_domain
    .command('add-rule')
    .argument('aggregate')
    .action((aggregate) => {
        console.log(`TODO`);
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
            {
                interfaceName: voca.titleCase(commandName),
            }
        );
        Template.write(
            PathTo.commandHandleFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/handle-create.ts.ejs`),
            {
                functionName: `handle${voca.titleCase(commandName)}`,
                commandTypeName: voca.titleCase(commandName),
                commandFileName: `${voca.titleCase(commandName)}.create.command`,
            }
        );
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
            {
                interfaceName: voca.titleCase(commandName),
            }
        );
        Template.write(
            PathTo.commandHandleFile(process.env.PWD, aggregateName, commandName),
            Template.templatePath(__dirname, `./templates/add-command/handle-update.ts.ejs`),
            {
                functionName: `handle${voca.titleCase(commandName)}`,
                commandTypeName: voca.titleCase(commandName),
                commandFileName: `${voca.titleCase(commandName)}.update.command`,
                aggregateTypeName: voca.titleCase(aggregateName),
                aggregateFileName: voca.titleCase(aggregateName),
            }
        );
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
