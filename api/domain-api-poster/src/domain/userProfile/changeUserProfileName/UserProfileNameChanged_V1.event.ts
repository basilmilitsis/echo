import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserProfileNameChanged_V1 = 'UserProfileNameChanged_V1',
}

export interface UserProfileNameChangedData_V1 extends CommandEventData {
    firstName: string;
    lastname: string;
}

export interface UserProfileNameChanged_V1 extends CommandEvent {
    type: EventType.UserProfileNameChanged_V1;
    data: UserProfileNameChangedData_V1;
}

export const buildUserProfileNameChanged_V1 = (id: Id, data: UserProfileNameChangedData_V1): UserProfileNameChanged_V1 => ({
    id: id,
    type: EventType.UserProfileNameChanged_V1,
    data: data,
});

export const isUserProfileNameChanged_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserProfileNameChangedData_V1> => {
    return event.type === EventType.UserProfileNameChanged_V1;
};
