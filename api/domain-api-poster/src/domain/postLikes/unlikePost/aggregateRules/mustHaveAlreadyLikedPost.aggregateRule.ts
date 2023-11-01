import { EvaluateCommandAggregateRule } from "@echo/lib-domain-api";
import { PostLikes } from "@root/domain/postLikes/PostLikes";
import { UnlikePost } from "@root/domain/postLikes/unlikePost/UnlikePost.upsert.command";

export const mustHaveAlreadyLikedPost: EvaluateCommandAggregateRule<UnlikePost, PostLikes> = (command: UnlikePost, aggregate: PostLikes): string[] => {
    return [];
} 