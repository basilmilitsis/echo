import { ValidateCommand } from "@echo/lib-domain-api";
import { ChangeUserName } from './ChangeUserName.update.command';

export const validateChangeUserName: ValidateCommand<ChangeUserName> = (command: ChangeUserName): string[] => {
    return [];
} 