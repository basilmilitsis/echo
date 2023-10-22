import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UserSavesPost } from './UserSavesPost.upsert.command';
import { PostSavesForUser } from '../PostSavesForUser';
import { buildUserSavedPostV1 } from './UserSavedPost_V1.event';

export const handleUserSavesPost: HandleUpsertCommand<UserSavesPost, PostSavesForUser> = (
    command: UserSavesPost,
    aggregate: PostSavesForUser | undefined
): CommandEvent[] => {
    return [buildUserSavedPostV1(command.id, {postId: command.postId})];
};
