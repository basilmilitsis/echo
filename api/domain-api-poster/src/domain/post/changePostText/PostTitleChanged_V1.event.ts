import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostTitleChanged_V1 = 'PostTitleChanged_V1',
}

export interface PostTitleChangedData_V1 extends CommandEventData {
}

export interface PostTitleChanged_V1 extends CommandEvent {
    type: EventType.PostTitleChanged_V1;
    data: PostTitleChangedData_V1;
}

export const buildPostTitleChanged_V1 = (id: Id, data: PostTitleChangedData_V1): PostTitleChanged_V1 => ({
    id: id,
    type: EventType.PostTitleChanged_V1,
    data: data,
});

export const isPostTitleChanged_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostTitleChangedData_V1> => {
    return event.type === EventType.PostTitleChanged_V1;
};
