import { CommandEvent, CommandEventData, DomainEvent, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserSavedPost_V1 = 'UserSavedPost_V1',
}

export interface UserSavedPostData_V1 extends CommandEventData {
    postId: Id;
}

export interface UserSavedPost_V1 extends CommandEvent {
    type: EventType.UserSavedPost_V1;
    data: UserSavedPostData_V1;
}

export const buildUserSavedPostV1 = (id: Id, data: UserSavedPostData_V1): UserSavedPost_V1 => ({
    id: id,
    type: EventType.UserSavedPost_V1,
    data: data,
});

export const isUserSavedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserSavedPostData_V1> => {
    return event.type === EventType.UserSavedPost_V1;
};
