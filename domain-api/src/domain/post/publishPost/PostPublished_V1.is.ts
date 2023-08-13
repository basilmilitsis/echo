import { DomainEvent } from '@root/common';
import { EventType, PostPublished_V1 } from './PostPublished_V1.event';

export const isPostPublished_V1 = (
    event: DomainEvent<string, unknown>
): event is DomainEvent<string, PostPublished_V1> => {
    return event.type === EventType.PostPublished_V1;
};
