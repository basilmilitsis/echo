import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { ChangeUserProfileName } from "@root/domain/userProfile/changeUserProfileName/ChangeUserProfileName.update.command";

export const userProfileMustExist: CommandIndexRule<ChangeUserProfileName> = async (command: ChangeUserProfileName, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   