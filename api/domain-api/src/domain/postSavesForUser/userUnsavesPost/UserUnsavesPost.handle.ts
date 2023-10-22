import { CommandEvent, HandleUpsertCommand } from '@echo/lib-domain-api';
import { UserUnsavesPost } from './UserUnsavesPost.upsert.command';
import { PostSavesForUser } from '../PostSavesForUser';
import { buildUserUnsavesPostV1 } from './UserUnsavesPost_V1.event';

export const handleUserUnsavesPost: HandleUpsertCommand<UserUnsavesPost, PostSavesForUser> = (
    command: UserUnsavesPost,
    aggregate: PostSavesForUser | undefined
): CommandEvent[] => {
    return [
        buildUserUnsavesPostV1(command.id, {postId: command.postId})
    ];
};
