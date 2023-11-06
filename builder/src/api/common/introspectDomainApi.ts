import * as voca from 'voca';
import { BuilderEnvironment, listFilesIn, listFoldersIn } from '@root/common';
import { CommandKind } from './CommandKind';
import { determineCommandKind } from './determineCommandKind';
import { PathNames, PathTo } from './PathTo';

export type FileInfo = {
    functionName: string;
    importName: string;
};
export type EventStructure = {
    eventType: string;
    eventFileName: string;
    commandFolder: string;
    eventKind: CommandKind;
    evolveFunction: string;
    evolveFilename: string;
    isFunctionName: string;
};
export type CommandInfo = {
    commandName: string;
    commandTypeName: string;
    commandKind: CommandKind;
    commandFileName: string;
    commandFolderName: string;
    validator: FileInfo;
    handle: FileInfo;
    commandAuthRules: FileInfo[];
    commandRules: FileInfo[];
    indexRules: FileInfo[];
    aggregateAuthRules: FileInfo[];
    aggregateRules: FileInfo[];
    events: EventStructure[];
};
export type AggregateInfo = {
    aggregateTypeName: string;
    aggregateFileName: string;
    aggregateFolder: string;
    commands: CommandInfo[];
};

const introspectCommand = (domainRootPath: string, aggregateName: string, commandName: string): CommandInfo => {
    const commandKind = determineCommandKind(BuilderEnvironment.pwd, aggregateName, commandName);
    const folders = listFoldersIn(PathTo.commandFolder(domainRootPath, aggregateName, commandName));

    const commandAuthRulesFiles = folders.includes(PathNames.commandAuthRulesFolder)
        ? listFilesIn(PathTo.commandAuthRulesFolder(domainRootPath, aggregateName, commandName), '.commandAuthRule.ts')
        : [];
    const commandRulesFiles = folders.includes(PathNames.commandRulesFolder)
        ? listFilesIn(PathTo.commandRulesFolder(domainRootPath, aggregateName, commandName), '.commandRule.ts')
        : [];
    const indexRulesFiles = folders.includes(PathNames.indexRulesFolder)
        ? listFilesIn(PathTo.indexRulesFolder(domainRootPath, aggregateName, commandName), '.indexRule.ts')
        : [];
    const aggregateRules =
        (commandKind === 'update' || commandKind === 'upsert') && folders.includes(PathNames.aggregateRulesFolder)
            ? listFilesIn(PathTo.aggregateRulesFolder(domainRootPath, aggregateName, commandName), '.aggregateRule.ts')
            : [];
    const aggregateAuthRules =
        (commandKind === 'update' || commandKind === 'upsert') && folders.includes(PathNames.aggregateAuthRulesFolder)
            ? listFilesIn(PathTo.aggregateAuthRulesFolder(domainRootPath, aggregateName, commandName), '.aggregateAuthRule.ts')
            : [];

    return {
        commandName: commandName,
        commandTypeName: voca.titleCase(commandName),
        commandKind: commandKind,
        commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
        commandFolderName: commandName,
        validator: {
            functionName: `validate${voca.titleCase(commandName)}`,
            importName: `${voca.titleCase(commandName)}.validate`,
        },
        handle: {
            functionName: `handle${voca.titleCase(commandName)}`,
            importName: `${voca.titleCase(commandName)}.handle`,
        },
        commandAuthRules: commandAuthRulesFiles.map(
            (fileName): FileInfo => ({
                functionName: fileName.replace('.commandAuthRule.ts', ''),
                importName: fileName.replace('.ts', ''),
            })
        ),
        commandRules: commandRulesFiles.map(
            (fileName): FileInfo => ({
                functionName: fileName.replace('.commandRule.ts', ''),
                importName: fileName.replace('.ts', ''),
            })
        ),
        indexRules: indexRulesFiles.map(
            (fileName): FileInfo => ({
                functionName: fileName.replace('.indexRule.ts', ''),
                importName: fileName.replace('.ts', ''),
            })
        ),
        aggregateAuthRules: aggregateAuthRules.map(
            (fileName): FileInfo => ({
                functionName: fileName.replace('.aggregateAuthRule.ts', ''),
                importName: fileName.replace('.ts', ''),
            })
        ),
        aggregateRules: aggregateRules.map(
            (fileName): FileInfo => ({
                functionName: fileName.replace('.aggregateRule.ts', ''),
                importName: fileName.replace('.ts', ''),
            })
        ),
        events:
            listFilesIn(PathTo.commandFolder(domainRootPath, aggregateName, commandName), '.event.ts').map(
                (fileName) => {
                    const eventName = fileName.replace('.event.ts', '');
                    return {
                        eventType: `${eventName}`,
                        eventFileName: fileName.replace('.ts', ''),
                        commandFolder: voca.camelCase(commandName),
                        eventKind: commandKind,
                        evolveFunction: `evolve${eventName}`,
                        evolveFilename: `${eventName}.evolve`,
                        isFunctionName: `is${eventName}`,
                    };
                }
            ) || [],
    };
};

export const introspectAggregate = (domainRootPath: string, aggregateName: string): AggregateInfo => {
    const commandFolderNames = listFoldersIn(PathTo.aggregateFolder(domainRootPath, aggregateName)).filter(
        (x) => !x.startsWith('_')
    );

    return {
        aggregateTypeName: voca.titleCase(aggregateName),
        aggregateFileName: voca.titleCase(aggregateName),
        aggregateFolder: voca.camelCase(aggregateName),
        commands: commandFolderNames.map((folderName) => introspectCommand(domainRootPath, aggregateName, folderName)),
    };
};

export const introspectDomain = (domainRootPath: string): AggregateInfo[] => {
    const aggregateNames = listFoldersIn(PathTo.domainFolder(domainRootPath));

    return aggregateNames.map((aggregateName) => {
        const commandFolderNames = listFoldersIn(PathTo.aggregateFolder(domainRootPath, aggregateName)).filter(
            (x) => !x.startsWith('_')
        );

        return {
            aggregateTypeName: voca.titleCase(aggregateName),
            aggregateFileName: voca.titleCase(aggregateName),
            aggregateFolder: voca.camelCase(aggregateName),
            commands: commandFolderNames.map((folderName) =>
                introspectCommand(domainRootPath, aggregateName, folderName)
            ),
        };
    });
};
