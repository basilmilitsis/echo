import path from 'node:path';
import * as voca from 'voca';

export enum PathNames {
    srcFolder = 'src',
    domainFolder = 'domain',
    commandFolder = 'command',
    commandAuthRulesFolder = 'commandAuthRules',
    commandRulesFolder = 'commandRules',
    indexRulesFolder = 'indexRules',
    aggregateAuthRulesFolder = 'aggregateAuthRules',
    aggregateRulesFolder = 'aggregateRules',
}

export class PathTo {
    static srcFolder = (pwd: string): string => path.join(pwd, PathNames.srcFolder);

    static domainFolder = (pwd: string): string => path.join(PathTo.srcFolder(pwd), PathNames.domainFolder);
    static aggregateFolder = (pwd: string, aggregate: string): string =>
        path.join(PathTo.domainFolder(pwd), voca.camelCase(aggregate));

    static commandFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.aggregateFolder(pwd, aggregate), voca.camelCase(command));
    static createCommandFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.create.command.ts`);
    static updateCommandFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.update.command.ts`);
    static upsertCommandFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.upsert.command.ts`);

    static commandAuthRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), PathNames.commandAuthRulesFolder);
    static commandRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), PathNames.commandRulesFolder);
    static indexRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), PathNames.indexRulesFolder);
    static aggregateAuthRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), PathNames.aggregateAuthRulesFolder);
    static aggregateRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), PathNames.aggregateRulesFolder);
}
