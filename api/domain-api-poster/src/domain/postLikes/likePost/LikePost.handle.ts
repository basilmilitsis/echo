import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { LikePost } from './LikePost.upsert.command';
import { PostLikes } from '../PostLikes';
import { buildPostLiked_V1 } from './PostLiked_V1.event';

export const handleLikePost: HandleUpsertCommand<LikePost, PostLikes> = (
    command: LikePost,
    aggregate: PostLikes | undefined
): CommandEvent[] => {
    return [buildPostLiked_V1(command.id, { userId: command.userId })];
};
