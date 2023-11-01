import { Aggregate } from './Aggregate';
import { Command } from './Command';

export type EvaluateCommandAggregateRule<C extends Command, A extends Aggregate> = (command: C, aggregate: A) => string[];

