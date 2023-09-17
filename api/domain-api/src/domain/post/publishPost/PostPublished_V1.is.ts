import { DomainEvent } from 'domain-api-base';
import { EventType, PostPublished_V1 } from './PostPublished_V1.event';

export const isPostPublished_V1 = (event: DomainEvent<string>): event is DomainEvent<string> => {
    return event.type === EventType.PostPublished_V1;
};
