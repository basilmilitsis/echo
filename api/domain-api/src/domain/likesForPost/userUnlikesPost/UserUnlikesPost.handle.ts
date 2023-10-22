import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UserUnlikesPost } from './UserUnlikesPost.upsert.command';
import { LikesForPost } from '../LikesForPost';
import { buildUserUnlikedPostV1 } from './UserUnlikedPost_V1.event';

export const handleUserUnlikesPost: HandleUpsertCommand<UserUnlikesPost, LikesForPost> = (
    command: UserUnlikesPost,
    aggregate: LikesForPost | undefined
): CommandEvent[] => {
    return [buildUserUnlikedPostV1(command.id, { userId: command.userId })];
};
