import * as voca from 'voca';
import { PathTo, determineCommandKind, listFilesIn, listFoldersIn } from "@root/common";

export type FileInfo = {
    functionName: string;
    importName: string;
};
export type CommandStructure = {
    command: string;
    commandType: 'create' | 'update';
    validator?: FileInfo;
    commandRules: FileInfo[];
    commandIndexRules: FileInfo[];
    commandAggregateRules: FileInfo[];
    evolvers: string[];
};
export type EventStructure = {
    eventType: string;
    eventFileName: string;
    commandFolder: string;
    eventKind: 'create' | 'update';
    evolveFunction: string;
    evolveFilename: string;
    isFileName: string;
    isFunctionName: string;
};
export type CommandInfo = {
    commandName: string;
    commandTypeName: string;
    commandKind: 'create' | 'update';
    commandFileName: string;
    commandFolderName: string;
    validator: FileInfo;
    handle: FileInfo;
    commandRules: FileInfo[];
    commandIndexRules: FileInfo[];
    commandAggregateRules: FileInfo[];
    events: EventStructure[];
}
export type AggregateInfo = {
    aggregateTypeName: string;
    aggregateFileName: string;
    aggregateFolder: string;
    commands: CommandInfo[];
}

const instrospectCommand = (domainRootPath: string, aggregateName: string, commandName: string): CommandInfo => {
    const commandKind = determineCommandKind(process.env.PWD, aggregateName, commandName);
    return {
        commandName: commandName,
        commandTypeName: voca.titleCase(commandName),
        commandKind: commandKind, // TODO: change model name
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
        commandRules:
            listFilesIn(PathTo.commandRulesFolder(domainRootPath, aggregateName, commandName), '.commandRule.ts')
                .map((fileName) => ({
                    functionName: fileName.replace('.commandRule.ts', ''),
                    importName: fileName.replace('.ts', ''),
                })) || [],
        commandIndexRules:
            listFilesIn(PathTo.commandIndexRulesFolder(domainRootPath, aggregateName, commandName), '.indexRule.ts')
                .map((fileName) => ({
                    functionName: fileName.replace('.indexRule.ts', ''),
                    importName: fileName.replace('.ts', ''),
                })) || [],
        commandAggregateRules:
            listFilesIn(PathTo.commandAggregateRulesFolder(domainRootPath, aggregateName, commandName), '.aggregateRule.ts')
                .map((fileName) => ({
                    functionName: fileName.replace('.aggregateRule.ts', ''),
                    importName: fileName.replace('.ts', ''),
                })) || [],
        events:
            listFilesIn(PathTo.commandFolder(domainRootPath, aggregateName, commandName), '.event.ts')
                .map((fileName) => {
                    const eventName = fileName.replace('.event.ts', '');
                    return {
                        eventType: `${eventName}`,
                        eventFileName: fileName,
                        commandFolder: voca.camelCase(commandName),
                        eventKind: commandKind,
                        evolveFunction: `evolve${eventName}`,
                        evolveFilename: `${eventName}.evolve`,
                        isFileName: `${eventName}.is`,
                        isFunctionName: `is${eventName}`,
                    }
                }) || [],
    };
}

export const introspectAggregate = (domainRootPath: string, aggregateName: string): AggregateInfo => {
    const commandFolderNames = listFoldersIn(PathTo.aggregateFolder(domainRootPath, aggregateName))
        .filter((x) => !x.startsWith('_'));

    return {
        aggregateTypeName: voca.titleCase(aggregateName),
        aggregateFileName: voca.titleCase(aggregateName),
        aggregateFolder: voca.camelCase(aggregateName),
        commands: commandFolderNames.map(folderName => instrospectCommand(domainRootPath, aggregateName, folderName))
    }
}

export const introspectDomain = (domainRootPath: string): AggregateInfo[] => {

    const aggregateNames = listFoldersIn(PathTo.domainFolder(domainRootPath));

    return aggregateNames.map((aggregateName) => {
        const commandFolderNames = listFoldersIn(PathTo.aggregateFolder(domainRootPath, aggregateName))
            .filter((x) => !x.startsWith('_'));

        return {
            aggregateTypeName: voca.titleCase(aggregateName),
            aggregateFileName: voca.titleCase(aggregateName),
            aggregateFolder: voca.camelCase(aggregateName),
            commands: commandFolderNames.map(folderName => instrospectCommand(domainRootPath, aggregateName, folderName))
        }
    });
}