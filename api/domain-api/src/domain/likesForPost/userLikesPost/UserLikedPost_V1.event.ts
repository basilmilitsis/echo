import { CommandEvent, CommandEventData, DomainEvent, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserLikedPost_V1 = 'UserLikedPost_V1',
}

export interface UserLikedPostData_V1 extends CommandEventData {
    userId: Id;
}

export interface UserLikedPost_V1 extends CommandEvent {
    type: EventType.UserLikedPost_V1;
    data: UserLikedPostData_V1;
}

export const buildUserLikedPostV1 = (id: Id, data: UserLikedPostData_V1): UserLikedPost_V1 => ({
    id: id,
    type: EventType.UserLikedPost_V1,
    data: data,
});

export const isUserLikedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserLikedPostData_V1> => {
    return event.type === EventType.UserLikedPost_V1;
};
