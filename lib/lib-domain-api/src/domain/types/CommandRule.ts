import { Command } from './Command';

export type CommandRule<C extends Command> = (command: C) => string[];
