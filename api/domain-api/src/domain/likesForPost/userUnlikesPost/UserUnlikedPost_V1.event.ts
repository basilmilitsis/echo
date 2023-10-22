import { CommandEvent, CommandEventData, DomainEvent, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserUnlikedPost_V1 = 'UserUnlikedPost_V1',
}

export interface UserUnlikedPostData_V1 extends CommandEventData {
    userId: Id;
}

export interface UserUnlikedPost_V1 extends CommandEvent {
    type: EventType.UserUnlikedPost_V1;
    data: UserUnlikedPostData_V1;
}

export const buildUserUnlikedPostV1 = (id: Id, data: UserUnlikedPostData_V1): UserUnlikedPost_V1 => ({
    id: id,
    type: EventType.UserUnlikedPost_V1,
    data: data,
});

export const isUserUnlikedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserUnlikedPostData_V1> => {
    return event.type === EventType.UserUnlikedPost_V1;
};
