import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserProfileLocationSet_V1 = 'UserProfileLocationSet_V1',
}

export interface UserProfileLocationSetData_V1 extends CommandEventData {
    lat: string;
    long: string;
}

export interface UserProfileLocationSet_V1 extends CommandEvent {
    type: EventType.UserProfileLocationSet_V1;
    data: UserProfileLocationSetData_V1;
}

export const buildUserProfileLocationSet_V1 = (id: Id, data: UserProfileLocationSetData_V1): UserProfileLocationSet_V1 => ({
    id: id,
    type: EventType.UserProfileLocationSet_V1,
    data: data,
});

export const isUserProfileLocationSet_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserProfileLocationSetData_V1> => {
    return event.type === EventType.UserProfileLocationSet_V1;
};
