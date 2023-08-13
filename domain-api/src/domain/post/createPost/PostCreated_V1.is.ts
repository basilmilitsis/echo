import { DomainEvent } from '@root/common';
import { EventType, PostCreatedData_v1 } from './PostCreated_V1.event';

export const isPostCreated_v1 = (
    event: DomainEvent<string, unknown>
): event is DomainEvent<string, PostCreatedData_v1> => {
    return event.type === EventType.postCreated_v1;
};
