import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandContext } from './CommandContext';
import { CommandEvent } from './CommandEvent';
import { CommandMetadata } from './CommandMetadata';

export type HandleUpsertCommand<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A | undefined,
    metadata: CommandMetadata,
    context: CommandContext
) => CommandEvent[];
