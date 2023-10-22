import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostLiked_V1 = 'PostLiked_V1',
}

export interface PostLikedData_V1 extends CommandEventData {
    userId: Id;
}

export interface PostLiked_V1 extends CommandEvent {
    type: EventType.PostLiked_V1;
    data: PostLikedData_V1;
}

export const buildPostLiked_V1 = (id: Id, data: PostLikedData_V1): PostLiked_V1 => ({
    id: id,
    type: EventType.PostLiked_V1,
    data: data,
});

export const isPostLiked_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostLikedData_V1> => {
    return event.type === EventType.PostLiked_V1;
};
