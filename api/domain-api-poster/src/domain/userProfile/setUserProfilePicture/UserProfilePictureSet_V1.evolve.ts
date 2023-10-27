import { DomainEvent } from '@echo/lib-domain-api';
import { UserProfile } from '../UserProfile';
import { UserProfilePictureSetData_V1 } from './UserProfilePictureSet_V1.event';

export const evolveUserProfilePictureSet_V1 = (
    aggregate: UserProfile,
    event: DomainEvent<string, UserProfilePictureSetData_V1>
): UserProfile => ({
    ...aggregate,
    profilePictureUrl: event.data.profilePictureUrl,
});
