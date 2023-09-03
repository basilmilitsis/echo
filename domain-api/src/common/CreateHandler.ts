import { Command } from './Command';
import { CommandEvent, CommandEventData } from './CommandEvent';

export type CreateHandler<C extends Command> = (
    command: C,
) => CommandEvent[];
