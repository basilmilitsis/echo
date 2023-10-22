import { ValidateCommand } from "@echo/lib-domain-api";
import { UnlikePost } from './UnlikePost.upsert.command';

export const validateUnlikePost: ValidateCommand<UnlikePost> = (command: UnlikePost): string[] => {
    //TODO
    return [];
} 