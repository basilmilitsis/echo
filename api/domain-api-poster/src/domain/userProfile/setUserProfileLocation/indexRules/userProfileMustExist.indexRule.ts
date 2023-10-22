import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { SetUserProfileLocation } from "@root/domain/userProfile/setUserProfileLocation/SetUserProfileLocation.update.command";

export const userProfileMustExist: CommandIndexRule<SetUserProfileLocation> = async (command: SetUserProfileLocation, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   