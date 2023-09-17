import * as fs from 'fs';
import * as voca from 'voca';

import { listFilesIn, determineCommandKind, PathTo } from '@root/common';

export type CommandFile = {
    functionName: string;
    importName: string;
};

export type CommandStructure = {
    command: string;
    commandType: 'create' | 'update';
    validator?: CommandFile;
    commandRules: CommandFile[];
    commandIndexRules: CommandFile[];
    commandAggregateRules: CommandFile[];
    evolvers: string[];
};

export const buildCommandStructures = (commands: string[], aggregate: string): CommandStructure[] => {
    const commandStructures: CommandStructure[] = [];
                
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        commandStructures.push({
            command: command,
            commandType: determineCommandKind(aggregate, command),
            validator: fs.existsSync(PathTo.validatorFile(aggregate, command))
                ? {
                      functionName: `validate${voca.titleCase(command)}`,
                      importName: `${voca.titleCase(command)}.validate`,
                  }
                : undefined,
            commandRules:
                listFilesIn(PathTo.commandRulesFolder(aggregate, command))
                    .filter((x) => x.endsWith('.commandRule.ts'))
                    .map((x) => ({
                        functionName: x.replace('.commandRule.ts', ''),
                        importName: x.replace('.ts', ''),
                    })) || [],
            commandIndexRules:
                listFilesIn(PathTo.commandIndexRulesFolder(aggregate, command))
                    .filter((x) => x.endsWith('.indexRule.ts'))
                    .map((x) => ({
                        functionName: x.replace('.indexRule.ts', ''),
                        importName: x.replace('.ts', ''),
                    })) || [],
            commandAggregateRules:
                listFilesIn(PathTo.commandAggregateRulesFolder(aggregate, command))
                    .filter((x) => x.endsWith('.aggregateRule.ts'))
                    .map((x) => ({
                        functionName: x.replace('.aggregateRule.ts', ''),
                        importName: x.replace('.ts', ''),
                    })) || [],
            evolvers: listFilesIn(PathTo.commandFolder(aggregate, command))
                .filter((x) => x.endsWith('.event.ts'))
                .map((x) => x.replace('.event.ts', '')),
        });
    }
    return commandStructures;
};
