import * as fs from 'fs';
import { PathTo } from './PathTo';
import { CommandKind } from './CommandKind';

export const determineCommandKind = (absDomainRootPath: string, aggregate: string, command: string): CommandKind => {
    const isupdateCommand = fs.existsSync(PathTo.updateCommandFile(absDomainRootPath, aggregate, command));
    if (isupdateCommand) {
        return 'update';
    }

    const isCreateCommand = fs.existsSync(PathTo.createCommandFile(absDomainRootPath, aggregate, command));
    if (isCreateCommand) {
        return 'create';
    }

    const isUpsertCommand = fs.existsSync(PathTo.upsertCommandFile(absDomainRootPath, aggregate, command));
    if (isUpsertCommand) {
        return 'upsert';
    }

    throw new Error(`Invalid command type for command: ${command}`);
};
