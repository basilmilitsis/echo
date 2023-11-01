import { Command } from './Command';
import { EventStream } from './EventStream';

export type EvaluateCommandIndexRule<C extends Command> = (command: C, eventStream: EventStream) => Promise<string[]>;

