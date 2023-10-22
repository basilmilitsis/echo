import { CommandAggregateRule } from "@echo/lib-domain-api";
import { PostLikes } from "@root/domain/postLikes/PostLikes";
import { LikePost } from "@root/domain/postLikes/likePost/LikePost.upsert.command";

export const mustNotHaveAlreadyLikedPost: CommandAggregateRule<LikePost, PostLikes> = (command: LikePost, aggregate: PostLikes): string[] => {
    // TODO
    return [];
} 