import { Command } from '@echo/lib-domain-api';

export interface SetUserProfilePicture extends Command {
    profilePictureUrl: string;
}
