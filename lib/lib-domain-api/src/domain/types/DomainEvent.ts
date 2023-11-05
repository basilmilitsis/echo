import { CommandEventData } from './CommandEvent';
import { Id } from './Id';

// TODO
// export enum DomainEventKind {
//     Create = 'Create',
//     Update = 'Update'
//}

export interface DomainEventMetadata {
    correlationId?: Id;
}

export interface DomainEvent<T extends string, D extends CommandEventData = CommandEventData> {
    aggregateId: Id;

    id: Id;
    type: T;
    //kind: DomainEventKind;

    data: D;
    meta: DomainEventMetadata;
}
