import { DomainEvent } from '@root/common';
import { EventType, PostArchived_V1 } from './PostArchived_V1.event';

export const isPostArchived_V1 = (
    event: DomainEvent<string, unknown>
): event is DomainEvent<string, PostArchived_V1> => {
    return event.type === EventType.PostArchived_V1;
};
