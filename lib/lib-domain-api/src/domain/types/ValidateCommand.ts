import { Command } from './Command';

export type ValidateCommand<C extends Command> = (command: C) => string[];
