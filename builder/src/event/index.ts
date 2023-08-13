import commander, { Command } from 'commander';
import { addToSubCommand_create } from './create/create';

export const subCommand_event = (): Command => {
    const command = new commander.Command('event');

    addToSubCommand_create(command);

    return command;
};
