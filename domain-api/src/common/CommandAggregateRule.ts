import { Aggregate } from './Aggregate';
import { Command } from './Command';

export type CommandAggregateRule<C extends Command, A extends Aggregate> = (command: C, aggregate: A) => string[];

export class CommandAggregateRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
} 