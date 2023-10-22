import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostSaved_V1 = 'PostSaved_V1',
}

export interface PostSavedData_V1 extends CommandEventData {
    postId: Id;
}

export interface PostSaved_V1 extends CommandEvent {
    type: EventType.PostSaved_V1;
    data: PostSavedData_V1;
}

export const buildPostSaved_V1 = (id: Id, data: PostSavedData_V1): PostSaved_V1 => ({
    id: id,
    type: EventType.PostSaved_V1,
    data: data,
});

export const isPostSaved_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostSavedData_V1> => {
    return event.type === EventType.PostSaved_V1;
};
