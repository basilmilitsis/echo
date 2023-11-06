import { EvaluateUpsertAggregateRule } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '@root/domain/userPostBookmarks/UserPostBookmarks';
import { UnbookmarkPost } from '@root/domain/userPostBookmarks/unbookmarkPost/UnbookmarkPost.upsert.command';

export const mustHaveAlreadySavedPost: EvaluateUpsertAggregateRule<UnbookmarkPost, UserPostBookmarks> = (
    command: UnbookmarkPost,
    aggregate: UserPostBookmarks | undefined
): string[] => {
    // TODO
    return [];
};
