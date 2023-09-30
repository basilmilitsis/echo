import * as voca from 'voca';

type CommandModel = {
    commandTypeName: string;
};

export const buildModel_command = (commandName: string): CommandModel => ({
    commandTypeName: voca.titleCase(commandName)
});
