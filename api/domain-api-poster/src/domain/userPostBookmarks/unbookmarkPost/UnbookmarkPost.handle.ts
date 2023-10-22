import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UnbookmarkPost } from './UnbookmarkPost.upsert.command';
import { UserPostBookmarks } from '../UserPostBookmarks';

export const handleUnbookmarkPost: HandleUpsertCommand<UnbookmarkPost, UserPostBookmarks> = (
    command: UnbookmarkPost,
    aggregate: UserPostBookmarks | undefined
): CommandEvent[] => {
    return [];
};
