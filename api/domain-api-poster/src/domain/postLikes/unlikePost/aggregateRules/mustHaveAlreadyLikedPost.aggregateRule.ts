import { CommandAggregateRule } from "@echo/lib-domain-api";
import { PostLikes } from "@root/domain/postLikes/PostLikes";
import { UnlikePost } from "@root/domain/postLikes/unlikePost/UnlikePost.upsert.command";

export const mustHaveAlreadyLikedPost: CommandAggregateRule<UnlikePost, PostLikes> = (command: UnlikePost, aggregate: PostLikes): string[] => {
    return [];
} 