import { ValidateCommand } from "@echo/lib-domain-api";
import { RegisterUser } from './RegisterUser.create.command';

export const validateRegisterUser: ValidateCommand<RegisterUser> = (command: RegisterUser): string[] => {
    return [];
} 