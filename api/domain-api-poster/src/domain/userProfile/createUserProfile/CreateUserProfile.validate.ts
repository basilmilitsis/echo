import { ValidateCommand } from "@echo/lib-domain-api";
import { CreateUserProfile } from './CreateUserProfile.create.command';

export const validateCreateUserProfile: ValidateCommand<CreateUserProfile> = (command: CreateUserProfile): string[] => {
    //TODO
    return [];
} 