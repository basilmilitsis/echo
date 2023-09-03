import * as voca from 'voca';

export class PathTo {
    static domainFolder = (): string => `./src/domain`;
    static aggregateFolder = (aggregate: string): string => `${PathTo.domainFolder()}/${voca.camelCase(aggregate)}`;
    static commandFolder = (aggregate: string, command: string): string =>
        `${PathTo.aggregateFolder(aggregate)}/${voca.camelCase(command)}`;

    static createCommandFile = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/${voca.titleCase(command)}.create.command.ts`;
    static updateCommandFile = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/${voca.titleCase(command)}.update.command.ts`;

    static commandRulesFolder = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/commandRules`;
    static commandIndexRulesFolder = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/indexRules`;
    static commandAggregateRulesFolder = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/aggregateRules`;

    static validatorFile = (aggregate: string, command: string): string =>
        `${PathTo.commandFolder(aggregate, command)}/${voca.titleCase(command)}.validate.ts`;
}

export class Thing {
    domainFolder = (): string => `./src/domain`;
}
