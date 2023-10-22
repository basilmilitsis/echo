import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandEvent } from './CommandEvent';

export type HandleUpdateCommand<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A
) => CommandEvent[];
