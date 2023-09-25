import path from 'node:path';
import * as voca from 'voca';

// TODO: use path.join
export class PathTo {
    static srcFolder = (pwd: string): string => path.join(pwd, '/src');

    static generatedFolder = (pwd: string): string => path.join(pwd, '/src/_generated');
    static operationsFile = (pwd: string, aggregateName: string): string =>
        path.join(PathTo.generatedFolder(pwd), `${voca.titleCase(aggregateName)}.operations.ts`);
    static restApiFile = (pwd: string): string => path.join(PathTo.generatedFolder(pwd), `rest.api.generated.ts`);
    static restApiSchema = (pwd: string): string =>
        path.join(PathTo.generatedFolder(pwd), `rest.schema.generated.json`);

    static domainFolder = (pwd: string): string => path.join(PathTo.srcFolder(pwd), 'domain');
    static aggregateFolder = (pwd: string, aggregate: string): string =>
        `${PathTo.domainFolder(pwd)}/${voca.camelCase(aggregate)}`;
    static commandFolder = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.aggregateFolder(pwd, aggregate)}/${voca.camelCase(command)}`;

    static createCommandFile = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(command)}.create.command.ts`;
    static updateCommandFile = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(command)}.update.command.ts`;

    static commandHandleFile = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(command)}.handle.ts`;

    static eventBuildFile = (pwd: string, aggregate: string, command: string, event): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(event)}_V1.build.ts`;
    static eventFile = (pwd: string, aggregate: string, command: string, event): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(event)}_V1.event.ts`;
    static eventEvolveFile = (pwd: string, aggregate: string, command: string, event): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(event)}_V1.evolve.ts`;
    static eventIsFile = (pwd: string, aggregate: string, command: string, event): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(event)}_V1.is.ts`;

    static commandRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/commandRules`;
    static commandIndexRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/indexRules`;
    static commandAggregateRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/aggregateRules`;

    static validatorFile = (pwd: string, aggregate: string, command: string): string =>
        `${PathTo.commandFolder(pwd, aggregate, command)}/${voca.titleCase(command)}.validate.ts`;
}
