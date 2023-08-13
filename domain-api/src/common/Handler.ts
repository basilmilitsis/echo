import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandEvent, CommandEventData } from './CommandEvent';

export type Handler<C extends Command, A extends Aggregate, CED extends CommandEventData> = (
    command: C,
    aggregate: A | undefined
) => CommandEvent<CED>[];
