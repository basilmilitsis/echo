import { CommandContext, CommandEvent, CommandMetadata, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UnbookmarkPost } from './UnbookmarkPost.upsert.command';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { buildPostUnbookmarked_V1 } from './PostUnbookmarked_V1.event';

export const handleUnbookmarkPost: HandleUpsertCommand<UnbookmarkPost, UserPostBookmarks> = (
    command: UnbookmarkPost,
    aggregate: UserPostBookmarks | undefined,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [buildPostUnbookmarked_V1(command.id, { postId: command.postId })];
};
