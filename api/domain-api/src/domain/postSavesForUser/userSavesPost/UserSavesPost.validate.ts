import { ValidateCommand } from "@echo/lib-domain-api";
import { UserSavesPost } from './UserSavesPost.upsert.command';

export const validateUserSavesPost: ValidateCommand<UserSavesPost> = (command: UserSavesPost): string[] => {
    return [];
} 