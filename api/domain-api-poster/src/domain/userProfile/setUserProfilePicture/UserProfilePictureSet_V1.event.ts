import { Id, DomainEvent, CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    UserProfilePictureSet_V1 = 'UserProfilePictureSet_V1',
}

export interface UserProfilePictureSetData_V1 extends CommandEventData {
    profilePictureUrl: string;
}

export interface UserProfilePictureSet_V1 extends CommandEvent {
    type: EventType.UserProfilePictureSet_V1;
    data: UserProfilePictureSetData_V1;
}

export const buildUserProfilePictureSet_V1 = (id: Id, data: UserProfilePictureSetData_V1): UserProfilePictureSet_V1 => ({
    id: id,
    type: EventType.UserProfilePictureSet_V1,
    data: data,
});

export const isUserProfilePictureSet_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserProfilePictureSetData_V1> => {
    return event.type === EventType.UserProfilePictureSet_V1;
};
