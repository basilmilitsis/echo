import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostArchived_V1 = 'PostArchived_V1',
}

export interface PostArchivedData_V1 extends CommandEventData {
}

export interface PostArchived_V1 extends CommandEvent {
    type: EventType.PostArchived_V1;
    data: PostArchivedData_V1;
}

export const buildPostArchived_V1 = (id: Id, data: PostArchivedData_V1): PostArchived_V1 => ({
    id: id,
    type: EventType.PostArchived_V1,
    data: data,
});

export const isPostArchived_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostArchivedData_V1> => {
    return event.type === EventType.PostArchived_V1;
};
