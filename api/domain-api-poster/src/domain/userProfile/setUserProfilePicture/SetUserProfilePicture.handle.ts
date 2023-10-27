import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { SetUserProfilePicture } from './SetUserProfilePicture.update.command';
import { UserProfile } from '../UserProfile';
import { buildUserProfilePictureSet_V1 } from './UserProfilePictureSet_V1.event';

export const handleSetUserProfilePicture: HandleUpdateCommand<SetUserProfilePicture, UserProfile> = (
    command: SetUserProfilePicture,
    aggregate: UserProfile
): CommandEvent[] => {
    return [
        buildUserProfilePictureSet_V1(command.id, {
            profilePictureUrl: command.profilePictureUrl,
        })
    ];
};
