import { ValidateCommand } from "@echo/lib-domain-api";
import { LikePost } from './LikePost.upsert.command';
import { buildPostLiked_V1 } from "./PostLiked_V1.event";

export const validateLikePost: ValidateCommand<LikePost> = (command: LikePost): string[] => {
    //TODO
    return [];
} 