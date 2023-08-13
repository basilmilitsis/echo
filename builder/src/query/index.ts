import commander, { Command } from 'commander';

export const subCommand_query = (): Command => {
    const subCommand = new commander.Command('query');
    subCommand.command('create');
    return subCommand;
};