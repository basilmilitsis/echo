import * as voca from 'voca';

type HandleCreateModel = {
    functionName: string;
    commandTypeName: string;
    commandFileName: string;
};

export const buildModel_handleCreate = (commandName: string): HandleCreateModel => ({
    functionName: `handle${voca.titleCase(commandName)}`,
    commandTypeName: voca.titleCase(commandName),
    commandFileName: `${voca.titleCase(commandName)}.create.command`,
});
