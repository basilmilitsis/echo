import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UserLikesPost } from './UserLikesPost.upsert.command';
import { LikesForPost } from '../LikesForPost';
import { buildUserLikedPostV1 } from './UserLikedPost_V1.build';

export const handleUserLikesPost: HandleUpsertCommand<UserLikesPost, LikesForPost> = (
    command: UserLikesPost,
    aggregate: LikesForPost | undefined
): CommandEvent[] => {
    return [buildUserLikedPostV1(command.id, { userId: command.userId })];
};
