import * as fs from 'fs';
import * as voca from 'voca';

import { listFilesIn, determineCommandKind, PathTo } from '@root/common';

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
    isFileName: string;
    isFunctionName: string;
};

export const buildEventStructures = (commands: string[], aggregate: string): EventStructure[] => {
    const eventStructures: EventStructure[] = [];
                
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        const commandKind = determineCommandKind(aggregate, command)
        const events = listFilesIn(PathTo.commandFolder(aggregate, command), '.event.ts')
        for (let j = 0; j < events.length; j++) {
            const eventFileName = events[j];
            const eventName = eventFileName.replace('.event.ts', '');
            eventStructures.push({
                eventType:  `${eventName}`,
                eventFileName: eventFileName,
                commandFolder: voca.camelCase(command),
                eventKind: commandKind,
                evolveFunction:  `evolve${eventName}`,
                evolveFilename: `${eventName}.evolve`,
                isFileName: `${eventName}.is`,
                isFunctionName: `is${eventName}`,
            });
        }
    }
    return eventStructures;
};
