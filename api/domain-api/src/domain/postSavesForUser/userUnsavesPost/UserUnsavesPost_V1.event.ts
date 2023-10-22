import { CommandEvent, CommandEventData, DomainEvent, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserUnsavesPost_V1 = 'UserUnsavesPost_V1',
}

export interface UserUnsavesPostData_V1 extends CommandEventData {
    postId: Id;
}

export interface UserUnsavesPost_V1 extends CommandEvent {
    type: EventType.UserUnsavesPost_V1;
    data: UserUnsavesPostData_V1;
}

export const buildUserUnsavesPostV1 = (id: Id, data: UserUnsavesPostData_V1): UserUnsavesPost_V1 => ({
    id: id,
    type: EventType.UserUnsavesPost_V1,
    data: data,
});

export const isUserUnsavesPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserUnsavesPostData_V1> => {
    return event.type === EventType.UserUnsavesPost_V1;
};
