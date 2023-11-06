import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { SetUserProfilePicture } from "@root/domain/userProfile/setUserProfilePicture/SetUserProfilePicture.update.command";

export const userProfileMustExist: EvaluateIndexRule<SetUserProfilePicture> = async (command: SetUserProfilePicture, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   