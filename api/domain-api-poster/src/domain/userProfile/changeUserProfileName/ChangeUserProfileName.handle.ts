import { CommandContext, CommandEvent, CommandMetadata, HandleUpdateCommand } from '@echo/lib-domain-api';
import { ChangeUserProfileName } from './ChangeUserProfileName.update.command';
import { UserProfile } from '../UserProfile';
import { buildUserProfileNameChanged_V1 } from './UserProfileNameChanged_V1.event';

export const handleChangeUserProfileName: HandleUpdateCommand<ChangeUserProfileName, UserProfile> = (
    command: ChangeUserProfileName,
    aggregate: UserProfile,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [
        buildUserProfileNameChanged_V1(command.id, {
            firstName: command.firstName,
            lastname: command.lastname,
        })
    ];
};
