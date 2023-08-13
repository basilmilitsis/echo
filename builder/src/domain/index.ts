import commander, { Command } from 'commander';
import { addToSubCommand_generate } from './generate/generate';

export const subCommand_domain = (): Command => {
    const subCommand = new commander.Command('domain');

    addToSubCommand_generate(subCommand);

    return subCommand;
};
