import * as fs from 'fs';
import * as voca from 'voca';

export const detectCreateOrUpdateCommand = (pathToCommandFolder: string, commandName: string): 'create' | 'update' => {
    const isCreateCommand = fs.existsSync(`${pathToCommandFolder}/${voca.titleCase(commandName)}.create.command.ts`);
    if (isCreateCommand) {
        return 'create';
    }

    const isupdateCommand = fs.existsSync(`${pathToCommandFolder}/${voca.titleCase(commandName)}.update.command.ts`);
    if (isupdateCommand) {
        return 'update';
    }
    
    throw new Error(`Unknown command type for command: [${commandName}] in folder [${pathToCommandFolder}]`);
};
