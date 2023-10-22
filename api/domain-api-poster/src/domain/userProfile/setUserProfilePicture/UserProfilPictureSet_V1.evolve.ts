import { DomainEvent } from '@echo/lib-domain-api';
import { UserProfile } from '../UserProfile';
import { UserProfilPictureSetData_V1 } from './UserProfilPictureSet_V1.event';

export const evolveUserProfilPictureSet_V1 = (
    aggregate: UserProfile,
    event: DomainEvent<string, UserProfilPictureSetData_V1>
): UserProfile => ({
    ...aggregate,
    profilePictureUrl: event.data.profilePictureUrl,
});
