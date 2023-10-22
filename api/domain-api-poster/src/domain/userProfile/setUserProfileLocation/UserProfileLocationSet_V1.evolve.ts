import { DomainEvent } from '@echo/lib-domain-api';
import { UserProfile } from '../UserProfile';
import { UserProfileLocationSetData_V1 } from './UserProfileLocationSet_V1.event';

export const evolveUserProfileLocationSet_V1 = (aggregate: UserProfile, event: DomainEvent<string, UserProfileLocationSetData_V1>): UserProfile => ({
    ...aggregate,
    location: {
        lat: event.data.lat,
        long: event.data.long,
    }
});