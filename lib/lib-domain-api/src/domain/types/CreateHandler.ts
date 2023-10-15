import { Command } from './Command';
import { CommandEvent } from './CommandEvent';

export type CreateHandler<C extends Command> = (
    command: C,
) => CommandEvent[];
