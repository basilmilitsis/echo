import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostUnliked_V1 = 'PostUnliked_V1',
}

export interface PostUnlikedData_V1 extends CommandEventData {
    userId: Id;
}

export interface PostUnliked_V1 extends CommandEvent {
    type: EventType.PostUnliked_V1;
    data: PostUnlikedData_V1;
}

export const buildPostUnliked_V1 = (id: Id, data: PostUnlikedData_V1): PostUnliked_V1 => ({
    id: id,
    type: EventType.PostUnliked_V1,
    data: data,
});

export const isPostUnliked_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostUnlikedData_V1> => {
    return event.type === EventType.PostUnliked_V1;
};
