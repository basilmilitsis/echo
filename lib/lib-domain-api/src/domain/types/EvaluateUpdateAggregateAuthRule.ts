import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandMetadata } from './CommandMetadata';

export type EvaluateUpdateAggregateAuthRule<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A,
    metadata: CommandMetadata
) => string[];
