import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostUnbookmarked_V1 = 'PostUnbookmarked_V1',
}

export interface PostUnbookmarkedData_V1 extends CommandEventData {
    postId: Id;
}

export interface PostUnbookmarked_V1 extends CommandEvent {
    type: EventType.PostUnbookmarked_V1;
    data: PostUnbookmarkedData_V1;
}

export const buildPostUnbookmarked_V1 = (id: Id, data: PostUnbookmarkedData_V1): PostUnbookmarked_V1 => ({
    id: id,
    type: EventType.PostUnbookmarked_V1,
    data: data,
});

export const isPostUnbookmarked_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostUnbookmarkedData_V1> => {
    return event.type === EventType.PostUnbookmarked_V1;
};
