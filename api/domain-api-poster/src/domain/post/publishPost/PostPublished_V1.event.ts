import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostPublished_V1 = 'PostPublished_V1',
}

export interface PostPublishedData_V1 extends CommandEventData {
}

export interface PostPublished_V1 extends CommandEvent {
    type: EventType.PostPublished_V1;
    data: PostPublishedData_V1;
}

export const buildPostPublished_V1 = (id: Id, data: PostPublishedData_V1): PostPublished_V1 => ({
    id: id,
    type: EventType.PostPublished_V1,
    data: data,
});

export const isPostPublished_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostPublishedData_V1> => {
    return event.type === EventType.PostPublished_V1;
};
