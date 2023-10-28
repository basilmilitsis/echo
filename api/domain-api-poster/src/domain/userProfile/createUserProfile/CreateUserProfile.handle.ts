import { CommandContext, CommandEvent, CommandMetadata, HandleCreateCommand } from '@echo/lib-domain-api';
import { CreateUserProfile } from './CreateUserProfile.create.command';
import { buildUserProfileCreated_V1 } from './UserProfileCreated_V1.event';

export const handleCreateUserProfile: HandleCreateCommand<CreateUserProfile> = (
    command: CreateUserProfile,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [
        buildUserProfileCreated_V1(command.id, {
            firstName: command.firstName,
            lastName: command.lastName,
        })
    ];
};
