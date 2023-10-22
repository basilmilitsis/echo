import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { BookmarkPost } from './BookmarkPost.upsert.command';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { buildPostSaved_V1 } from './PostSaved_V1.event';

export const handleBookmarkPost: HandleUpsertCommand<BookmarkPost, UserPostBookmarks> = (
    command: BookmarkPost,
    aggregate: UserPostBookmarks | undefined
): CommandEvent[] => {
    return [buildPostSaved_V1(command.id, {postId: command.postId})];
};
