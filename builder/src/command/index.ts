import commander, { Command } from 'commander';
import { addToSubCommand_create } from './create/create';

export const subCommand_command = (): Command => {
    const command = new commander.Command('command');

    addToSubCommand_create(command);

    return command;
};
