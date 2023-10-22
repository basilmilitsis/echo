import { ValidateCommand } from "@echo/lib-domain-api";
import { UserLikesPost } from './UserLikesPost.upsert.command';

export const validateUserLikesPost: ValidateCommand<UserLikesPost> = (command: UserLikesPost): string[] => {
    return [];
} 