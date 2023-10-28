import { CommandAuthRule, CommandMetadata } from "@echo/lib-domain-api";
import { ChangeUserProfileName } from "@root/domain/userProfile/changeUserProfileName/ChangeUserProfileName.update.command";

export const userIdMustMatchToken: CommandAuthRule<ChangeUserProfileName> = (command: ChangeUserProfileName, metadata: CommandMetadata): string[] => {
    if(command.id !== metadata.credentials?.id) {
        return ['Not authorized to change this user profile'];
    }
    return [];
} 