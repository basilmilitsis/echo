import path from 'node:path';
import * as voca from 'voca';

export class PathTo {
    static srcFolder = (pwd: string): string => path.join(pwd, '/src');

    static generatedFolder = (pwd: string): string => path.join(PathTo.srcFolder(pwd), '_generated');
    static operationsFile = (pwd: string, aggregateName: string): string =>
        path.join(PathTo.generatedFolder(pwd), `${voca.titleCase(aggregateName)}.operations.ts`);
    static restApiFile = (pwd: string): string => path.join(PathTo.generatedFolder(pwd), `rest.api.generated.ts`);
    static restApiSchema = (pwd: string): string =>
        path.join(PathTo.generatedFolder(pwd), `rest.schema.generated.json`);

    static domainFolder = (pwd: string): string => path.join(PathTo.srcFolder(pwd), 'domain');
    static aggregateFolder = (pwd: string, aggregate: string): string =>
        path.join(PathTo.domainFolder(pwd), voca.camelCase(aggregate));
    static aggregateFile = (pwd: string, aggregate: string): string =>
        path.join(PathTo.aggregateFolder(pwd, aggregate), `${voca.titleCase(aggregate)}.ts`);

    static commandFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.aggregateFolder(pwd, aggregate), voca.camelCase(command));
    static createCommandFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.create.command.ts`);
    static updateCommandFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.update.command.ts`);
    static commandHandleFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.handle.ts`);
    static validatorFile = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(command)}.validate.ts`);

    static eventBuildFile = (pwd: string, aggregate: string, command: string, event): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(event)}_V1.build.ts`);
    static eventFile = (pwd: string, aggregate: string, command: string, event): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(event)}_V1.event.ts`);
    static eventEvolveFile = (pwd: string, aggregate: string, command: string, event): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(event)}_V1.evolve.ts`);
    static eventIsFile = (pwd: string, aggregate: string, command: string, event): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), `${voca.titleCase(event)}_V1.is.ts`);

    static commandRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'commandRules');
    static commandRulesGitkeep = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandRulesFolder(pwd, aggregate, command), '.gitkeep');
    static commandRuleFolder = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(PathTo.commandRulesFolder(pwd, aggregate, command), voca.camelCase(rule));
    static commandRuleFile = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(PathTo.commandRuleFolder(pwd, aggregate, command, rule), `${voca.camelCase(rule)}.commandRule.ts`);

    static indexRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'indexRules');
    static indexRulesGitkeep = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.indexRulesFolder(pwd, aggregate, command), '.gitkeep');
    static indexRuleFolder = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(PathTo.indexRulesFolder(pwd, aggregate, command), voca.camelCase(rule));
    static indexRuleFile = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(PathTo.indexRuleFolder(pwd, aggregate, command, rule), `${voca.camelCase(rule)}.indexRule.ts`);

    static aggregateRulesFolder = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.commandFolder(pwd, aggregate, command), 'aggregateRules');
    static aggregateRulesGitkeep = (pwd: string, aggregate: string, command: string): string =>
        path.join(PathTo.aggregateRulesFolder(pwd, aggregate, command), '.gitkeep');
    static aggregateRuleFolder = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(PathTo.aggregateRulesFolder(pwd, aggregate, command), voca.camelCase(rule));
    static aggregateRuleFile = (pwd: string, aggregate: string, command: string, rule: string): string =>
        path.join(
            PathTo.aggregateRuleFolder(pwd, aggregate, command, rule),
            `${voca.camelCase(rule)}.aggregateRule.ts`
        );

    static eslintFile = (pwd: string): string => path.join(pwd, `.eslintrc.json`);
    static gitignoreFile = (pwd: string): string => path.join(pwd, `.gitignore`);
    static prettierrcFile = (pwd: string): string => path.join(pwd, `.prettierrc.json`);
    static jestFile = (pwd: string): string => path.join(pwd, `.jest.config.js`);
    static packageFile = (pwd: string): string => path.join(pwd, `package.json`);
    static envFile = (pwd: string): string => path.join(pwd, `.env`);
    static tsconfigDistFile = (pwd: string): string => path.join(pwd, `tsconfig.dist.json`);
    static tsconfigFile = (pwd: string): string => path.join(pwd, `tsconfig.json`);

    static indexFile = (pwd: string): string => path.join(PathTo.srcFolder(pwd), `index.ts`);
    static domainGitkeepFile = (pwd: string): string => path.join(PathTo.domainFolder(pwd), `.gitkeep`);
}
