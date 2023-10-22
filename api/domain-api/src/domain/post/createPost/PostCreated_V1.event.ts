import { CommandEvent, CommandEventData, DomainEvent, Id } from '@echo/lib-domain-api';

export enum EventType {
    PostCreated_V1 = 'PostCreated_V1',
}

export interface PostCreatedData_V1 extends CommandEventData {
    text: string;
    images: string[];
}

export interface PostCreated_V1 extends CommandEvent {
    type: EventType.PostCreated_V1;
    data: PostCreatedData_V1;
}

export const buildPostCreated_V1 = (id: Id, data: PostCreatedData_V1): PostCreated_V1 => ({
    id: id,
    type: EventType.PostCreated_V1,
    data: data,
});

export const isPostCreated_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostCreatedData_V1> => {
    return event.type === EventType.PostCreated_V1;
};
