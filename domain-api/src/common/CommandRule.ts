import { Command } from './Command';

export type CommandRule<C extends Command> = (command: C) => string[];

export class CommandRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
} 