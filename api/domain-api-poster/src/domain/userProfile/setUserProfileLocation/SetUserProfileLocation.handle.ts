import { CommandContext, CommandEvent, CommandMetadata, HandleUpdateCommand } from '@echo/lib-domain-api';
import { SetUserProfileLocation } from './SetUserProfileLocation.update.command';
import { UserProfile } from '../UserProfile';
import { buildUserProfileLocationSet_V1 } from './UserProfileLocationSet_V1.event';

export const handleSetUserProfileLocation: HandleUpdateCommand<SetUserProfileLocation, UserProfile> = (
    command: SetUserProfileLocation,
    aggregate: UserProfile,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [
        buildUserProfileLocationSet_V1(command.id, {
            lat: command.lat,
            long: command.long,
        })
    ];
};
