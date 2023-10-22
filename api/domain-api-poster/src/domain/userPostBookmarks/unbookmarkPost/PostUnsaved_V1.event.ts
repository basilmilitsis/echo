import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostUnsaved_V1 = 'PostUnsaved_V1',
}

export interface PostUnsavedData_V1 extends CommandEventData {
}

export interface PostUnsaved_V1 extends CommandEvent {
    type: EventType.PostUnsaved_V1;
    data: PostUnsavedData_V1;
}

export const buildPostUnsaved_V1 = (id: Id, data: PostUnsavedData_V1): PostUnsaved_V1 => ({
    id: id,
    type: EventType.PostUnsaved_V1,
    data: data,
});

export const isPostUnsaved_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostUnsavedData_V1> => {
    return event.type === EventType.PostUnsaved_V1;
};
