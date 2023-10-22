import { DomainEvent } from '@echo/lib-domain-api';
import { UserProfile } from '../UserProfile';
import { UserProfileCreatedData_V1 } from './UserProfileCreated_V1.event';

export const evolveUserProfileCreated_V1 = (event: DomainEvent<string, UserProfileCreatedData_V1>): UserProfile => ({
    id: event.id,
    firstName: event.data.firstName,
    lastname: event.data.lastname,
    profilePictureUrl: undefined,
    location: undefined,
});