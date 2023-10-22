import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserRegistered_V1 = 'UserRegistered_V1',
}

export interface UserRegisteredData_V1 extends CommandEventData {
}

export interface UserRegistered_V1 extends CommandEvent {
    type: EventType.UserRegistered_V1;
    data: UserRegisteredData_V1;
}

export const buildUserRegistered_V1 = (id: Id, data: UserRegisteredData_V1): UserRegistered_V1 => ({
    id: id,
    type: EventType.UserRegistered_V1,
    data: data,
});

export const isUserRegistered_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserRegisteredData_V1> => {
    return event.type === EventType.UserRegistered_V1;
};
