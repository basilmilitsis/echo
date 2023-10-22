import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UnlikePost } from './UnlikePost.upsert.command';
import { PostLikes } from '../PostLikes';
import { buildPostUnliked_V1 } from './PostUnliked_V1.event';

export const handleUnlikePost: HandleUpsertCommand<UnlikePost, PostLikes> = (
    command: UnlikePost,
    aggregate: PostLikes | undefined
): CommandEvent[] => {
    return [buildPostUnliked_V1(command.id, { userId: command.userId })];
};
