import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { SetUserProfilePicture } from './SetUserProfilePicture.update.command';
import { UserProfile } from '../UserProfile';
import { buildUserProfilPictureSet_V1 } from './UserProfilPictureSet_V1.event';

export const handleSetUserProfilePicture: HandleUpdateCommand<SetUserProfilePicture, UserProfile> = (
    command: SetUserProfilePicture,
    aggregate: UserProfile
): CommandEvent[] => {
    return [
        buildUserProfilPictureSet_V1(command.id, {
            profilePictureUrl: command.profilePictureUrl,
        })
    ];
};
