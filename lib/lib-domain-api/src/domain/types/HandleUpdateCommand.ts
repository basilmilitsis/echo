import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandContext } from './CommandContext';
import { CommandEvent } from './CommandEvent';
import { CommandMetadata } from './CommandMetadata';

export type HandleUpdateCommand<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A,
    metadata: CommandMetadata,
    context: CommandContext
) => CommandEvent[];
