import { Aggregate } from './Aggregate';
import { Command } from './Command';

export type EvaluateUpdateAggregateRule<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A
) => string[];
