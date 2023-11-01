import { Command } from './Command';

export type EvaluateCommandRule<C extends Command> = (command: C) => string[];
