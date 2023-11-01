import { Command } from './Command';
import { CommandMetadata } from './CommandMetadata';

export type EvaluateCommandAuthRule<C extends Command> = (command: C, metadata: CommandMetadata) => string[];
