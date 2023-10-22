import { Command } from './Command';
import { CommandEvent } from './CommandEvent';

export type HandleCreateCommand<C extends Command> = (
    command: C,
) => CommandEvent[];
