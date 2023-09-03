import { DomainEvent } from '@root/common';
import { EventType, PostCreatedData_V1 } from './PostCreated_V1.event';

export const isPostCreated_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostCreatedData_V1> => {
    return event.type === EventType.PostCreated_V1;
};
