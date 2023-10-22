import { DomainEvent } from '@echo/lib-domain-api';
import { UserProfile } from '../UserProfile';
import { UserProfileNameChangedData_V1 } from './UserProfileNameChanged_V1.event';

export const evolveUserProfileNameChanged_V1 = (
    aggregate: UserProfile,
    event: DomainEvent<string, UserProfileNameChangedData_V1>
): UserProfile => ({
    ...aggregate,
    firstName: event.data.firstName,
    lastname: event.data.lastname,
});
