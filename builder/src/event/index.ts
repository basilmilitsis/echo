import commander, { Command } from 'commander';
import { addToSubCommand_create } from './add/add';

export const subCommand_event = (): Command => {
    const command = new commander.Command('event');

    addToSubCommand_create(command);

    return command;
};
