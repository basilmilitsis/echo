import { Command } from './Command';
import { CommandMetadata } from './CommandMetadata';

export type CommandAuthRule<C extends Command> = (command: C, metadata: CommandMetadata) => string[];
