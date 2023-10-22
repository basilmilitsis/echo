import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostUnpublished_V1 = 'PostUnpublished_V1',
}

export interface PostUnpublishedData_V1 extends CommandEventData {
}

export interface PostUnpublished_V1 extends CommandEvent {
    type: EventType.PostUnpublished_V1;
    data: PostUnpublishedData_V1;
}

export const buildPostUnpublished_V1 = (id: Id, data: PostUnpublishedData_V1): PostUnpublished_V1 => ({
    id: id,
    type: EventType.PostUnpublished_V1,
    data: data,
});

export const isPostUnpublished_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostUnpublishedData_V1> => {
    return event.type === EventType.PostUnpublished_V1;
};
