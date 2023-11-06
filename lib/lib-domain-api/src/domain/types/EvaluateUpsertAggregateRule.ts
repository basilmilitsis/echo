import { Aggregate } from './Aggregate';
import { Command } from './Command';

export type EvaluateUpsertAggregateRule<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A | undefined
) => string[];
