import { ValidateCommand } from "@echo/lib-domain-api";
import { SetUserProfilePicture } from './SetUserProfilePicture.update.command';

export const validateSetUserProfilePicture: ValidateCommand<SetUserProfilePicture> = (command: SetUserProfilePicture): string[] => {
    //TODO
    return [];
} 