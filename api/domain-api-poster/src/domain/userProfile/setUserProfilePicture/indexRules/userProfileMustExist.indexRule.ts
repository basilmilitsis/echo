import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { SetUserProfilePicture } from "@root/domain/userProfile/setUserProfilePicture/SetUserProfilePicture.update.command";

export const userProfileMustExist: CommandIndexRule<SetUserProfilePicture> = async (command: SetUserProfilePicture, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   