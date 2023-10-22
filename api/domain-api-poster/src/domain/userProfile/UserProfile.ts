import { Aggregate } from '@echo/lib-domain-api';

export interface UserLocation {
    lat: string;
    long: string;
}

export interface UserProfile extends Aggregate {
    firstName: string;
    lastname: string;
    profilePictureUrl: string | undefined;
    location: UserLocation | undefined;
}
