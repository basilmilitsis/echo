import * as fs from 'fs';
import * as voca from 'voca';

import { PathTo } from './PathTo';
import { listFilesIn } from '@root/common';

export type EventFile = {
    functionName: string;
    importName: string;
};

export type EventStructure = {
    eventType: string;
    eventFileName: string;
    commandFolder: string;
    eventKind: 'create' | 'update';
    evolveFunction: string;
    evolveFilename: string;
};

export const buildEventStructures = (commands: string[], aggregate: string): EventStructure[] => {
    const eventStructures: EventStructure[] = [];
                
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        const isCreateCommand = fs.existsSync(PathTo.createCommandFile(aggregate, command));
        const isupdateCommand = fs.existsSync(PathTo.updateCommandFile(aggregate, command));
        if (!isCreateCommand && !isupdateCommand) {
            throw new Error(`Unknown command type for command: ${command}`);
        }

        const events = listFilesIn(PathTo.commandFolder(aggregate, command), '.event.ts')
        for (let j = 0; j < events.length; j++) {
            const eventFileName = events[j];
            const eventName = eventFileName.replace('.event.ts', '');
            eventStructures.push({
                eventType:  `${eventName}`,
                eventFileName: eventFileName,
                commandFolder: voca.camelCase(command),
                eventKind: isCreateCommand ? 'create' : 'update',
                evolveFunction:  `evolve${eventName}`,
                evolveFilename: `${eventName}.evolve`
            });
        }
    }
    return eventStructures;
};
