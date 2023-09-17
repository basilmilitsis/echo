import commander, { Command } from 'commander';
import { addToSubCommand_generateSchema } from './generate-schema/generate-schema';
import { addToSubCommand_generateApi } from './generate-api/generate-api';

export const subCommand_apiRest = (): Command => {
    const subCommand = new commander.Command('api-rest');

    addToSubCommand_generateSchema(subCommand);
    addToSubCommand_generateApi(subCommand);

    return subCommand;
};
