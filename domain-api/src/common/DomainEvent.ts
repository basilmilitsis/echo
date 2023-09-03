import { CommandEventData } from './CommandEvent';
import { Id } from './types';

// export enum DomainEventKind {
//     Create = 'Create',
//     Update = 'Update'
//}

export interface DomainEvent<T extends string, D extends CommandEventData = CommandEventData> {
    aggregateId: Id;

    id: Id;
    type: T;
    //kind: DomainEventKind;

    data: D;
    meta: {
        correlationId?: Id;
    };
}
