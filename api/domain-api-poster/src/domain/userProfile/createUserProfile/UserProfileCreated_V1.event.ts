import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserProfileCreated_V1 = 'UserProfileCreated_V1',
}

export interface UserProfileCreatedData_V1 extends CommandEventData {
    firstName: string;
    lastname: string;
}

export interface UserProfileCreated_V1 extends CommandEvent {
    type: EventType.UserProfileCreated_V1;
    data: UserProfileCreatedData_V1;
}

export const buildUserProfileCreated_V1 = (id: Id, data: UserProfileCreatedData_V1): UserProfileCreated_V1 => ({
    id: id,
    type: EventType.UserProfileCreated_V1,
    data: data,
});

export const isUserProfileCreated_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserProfileCreatedData_V1> => {
    return event.type === EventType.UserProfileCreated_V1;
};
