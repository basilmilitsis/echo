import * as fs from 'fs';
import { PathTo } from '@root/common';


export const determineCommandKind = (aggregate: string, command: string): 'create' | 'update' => {
    const isupdateCommand = fs.existsSync(PathTo.updateCommandFile(aggregate, command));

    if (isupdateCommand) {
        return 'update';
    }

    const isCreateCommand = fs.existsSync(PathTo.createCommandFile(aggregate, command));
    if (isCreateCommand) {
        return 'create';
    }

    throw new Error(`Unknown command type for command: ${command}`);
};
