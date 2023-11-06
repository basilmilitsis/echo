import { EvaluateUpsertAggregateRule } from '@echo/lib-domain-api';
import { PostLikes } from '@root/domain/postLikes/PostLikes';
import { UnlikePost } from '@root/domain/postLikes/unlikePost/UnlikePost.upsert.command';

export const mustHaveAlreadyLikedPost: EvaluateUpsertAggregateRule<UnlikePost, PostLikes> = (
    command: UnlikePost,
    aggregate: PostLikes | undefined
): string[] => {
    return [];
};
