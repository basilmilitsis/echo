import { ValidateCommand } from "@echo/lib-domain-api";
import { ChangeUserProfileName } from './ChangeUserProfileName.update.command';

export const validateChangeUserProfileName: ValidateCommand<ChangeUserProfileName> = (command: ChangeUserProfileName): string[] => {
    //TODO
    return [];
} 