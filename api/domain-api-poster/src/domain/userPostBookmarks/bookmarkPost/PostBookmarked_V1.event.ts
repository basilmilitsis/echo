import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostBookmarked_V1 = 'PostBookmarked_V1',
}

export interface PostBookmarkedData_V1 extends CommandEventData {
    postId: Id;
}

export interface PostBookmarked_V1 extends CommandEvent {
    type: EventType.PostBookmarked_V1;
    data: PostBookmarkedData_V1;
}

export const buildPostBookmarked_V1 = (id: Id, data: PostBookmarkedData_V1): PostBookmarked_V1 => ({
    id: id,
    type: EventType.PostBookmarked_V1,
    data: data,
});

export const isPostBookmarked_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostBookmarkedData_V1> => {
    return event.type === EventType.PostBookmarked_V1;
};
