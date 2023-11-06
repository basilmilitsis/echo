import { Aggregate } from './Aggregate';
import { Command } from './Command';
import { CommandMetadata } from './CommandMetadata';

export type EvaluateUpsertAggregateAuthRule<C extends Command, A extends Aggregate> = (
    command: C,
    aggregate: A | undefined,
    metadata: CommandMetadata
) => string[];
