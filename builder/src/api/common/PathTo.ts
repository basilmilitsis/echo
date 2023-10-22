import path from 'node:path';
import * as voca from 'voca';

// TODO: remove
export class PathTo {
    static srcFolder = (pwd: string): string => path.join(pwd, '/src');

    static domainFolder = (pwd: string): string => path.join(PathTo.srcFolder(pwd), 'domain');
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

    static commandRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'commandRules');
    static indexRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'indexRules');
    static aggregateRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'aggregateRules');
}
