import { ValidateCommand } from "@echo/lib-domain-api";
import { SetUserProfileLocation } from './SetUserProfileLocation.update.command';

export const validateSetUserProfileLocation: ValidateCommand<SetUserProfileLocation> = (command: SetUserProfileLocation): string[] => {
    //TODO
    return [];
} 