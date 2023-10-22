import { ValidateCommand } from "@echo/lib-domain-api";
import { UserUnlikesPost } from './UserUnlikesPost.upsert.command';

export const validateUserUnlikesPost: ValidateCommand<UserUnlikesPost> = (command: UserUnlikesPost): string[] => {
    return [];
} 