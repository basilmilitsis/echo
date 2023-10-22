import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandEvent } from './CommandEvent';

export type HandleUpsertCommand<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A | undefined
) => CommandEvent[];
