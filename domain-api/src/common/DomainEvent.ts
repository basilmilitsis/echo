import { Id } from './types';

export interface DomainEvent<T extends string, D> {
    aggregateId: Id;

    id: Id;
    type: T;

    data: D;
    meta: {
        correlationId?: Id;
    };
}
