import { ValidateCommand } from "@echo/lib-domain-api";
import { UserUnsavesPost } from './UserUnsavesPost.upsert.command';

export const validateUserUnsavesPost: ValidateCommand<UserUnsavesPost> = (command: UserUnsavesPost): string[] => {
    return [];
} 