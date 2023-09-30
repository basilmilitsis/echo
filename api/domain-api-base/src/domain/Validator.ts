import { Command } from './Command';

export type Validator<C extends Command> = (command: C) => string[];
