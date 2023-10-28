import { Command } from './Command';
import { CommandContext } from './CommandContext';
import { CommandEvent } from './CommandEvent';
import { CommandMetadata } from './CommandMetadata';

export type HandleCreateCommand<C extends Command> = (
    command: C,
    metadata: CommandMetadata,
    context: CommandContext
) => CommandEvent[];
