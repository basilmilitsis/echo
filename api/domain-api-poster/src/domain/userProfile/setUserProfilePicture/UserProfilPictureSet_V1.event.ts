import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserProfilPictureSet_V1 = 'UserProfilPictureSet_V1',
}

export interface UserProfilPictureSetData_V1 extends CommandEventData {
    profilePictureUrl: string;
}

export interface UserProfilPictureSet_V1 extends CommandEvent {
    type: EventType.UserProfilPictureSet_V1;
    data: UserProfilPictureSetData_V1;
}

export const buildUserProfilPictureSet_V1 = (id: Id, data: UserProfilPictureSetData_V1): UserProfilPictureSet_V1 => ({
    id: id,
    type: EventType.UserProfilPictureSet_V1,
    data: data,
});

export const isUserProfilPictureSet_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserProfilPictureSetData_V1> => {
    return event.type === EventType.UserProfilPictureSet_V1;
};
