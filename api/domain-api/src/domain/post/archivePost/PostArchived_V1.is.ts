import { DomainEvent } from 'domain-api-base';
import { EventType, PostArchivedData_V1 } from './PostArchived_V1.event';

export const isPostArchived_V1 = (event: DomainEvent<string>): event is DomainEvent<string> => {
    return event.type === EventType.PostArchived_V1;
};
