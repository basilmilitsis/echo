import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandEvent, CommandEventData } from './CommandEvent';

export type UpdateHandler<C extends Command, A extends Aggregate, CED extends CommandEventData> = (
    command: C,
    aggregate: A | undefined
) => CommandEvent<CED>[];
