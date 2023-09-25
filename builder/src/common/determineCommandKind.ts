import * as fs from 'fs';
import { PathTo } from '@root/common';


export const determineCommandKind = (absDomainRootPath: string, aggregate: string, command: string): 'create' | 'update' => {
    const isupdateCommand = fs.existsSync(PathTo.updateCommandFile(absDomainRootPath, aggregate, command));

    if (isupdateCommand) {
        return 'update';
    }

    const isCreateCommand = fs.existsSync(PathTo.createCommandFile(absDomainRootPath, aggregate, command));
    if (isCreateCommand) {
        return 'create';
    }

    throw new Error(`Unknown command type for command: ${command}`);
};
