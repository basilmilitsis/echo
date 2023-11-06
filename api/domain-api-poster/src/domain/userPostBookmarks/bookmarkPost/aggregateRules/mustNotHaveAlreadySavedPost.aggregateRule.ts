import { EvaluateUpsertAggregateRule } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '@root/domain/userPostBookmarks/UserPostBookmarks';
import { BookmarkPost } from '@root/domain/userPostBookmarks/bookmarkPost/BookmarkPost.upsert.command';

export const mustNotHaveAlreadySavedPost: EvaluateUpsertAggregateRule<BookmarkPost, UserPostBookmarks> = (
    command: BookmarkPost,
    aggregate: UserPostBookmarks | undefined
): string[] => {
    // TODO
    return [];
};
