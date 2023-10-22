import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserNameChanged_V1 = 'UserNameChanged_V1',
}

export interface UserNameChangedData_V1 extends CommandEventData {
}

export interface UserNameChanged_V1 extends CommandEvent {
    type: EventType.UserNameChanged_V1;
    data: UserNameChangedData_V1;
}

export const buildUserNameChanged_V1 = (id: Id, data: UserNameChangedData_V1): UserNameChanged_V1 => ({
    id: id,
    type: EventType.UserNameChanged_V1,
    data: data,
});

export const isUserNameChanged_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserNameChangedData_V1> => {
    return event.type === EventType.UserNameChanged_V1;
};
