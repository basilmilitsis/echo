import { Command } from './Command';
import { EventStream } from './EventStream';

export type EvaluateIndexRule<C extends Command> = (command: C, eventStream: EventStream) => Promise<string[]>;
