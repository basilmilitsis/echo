import { Command } from './Command';
import { EventStream } from './EventStream';

export type CommandIndexRule<C extends Command> = (command: C, eventStream: EventStream) => Promise<string[]>;

export class CommandIndexRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
} 