import { CommandEvent, UpdateHandler } from '@root/common';
import { ChangeTitleOfPost } from './ChangeTitleOfPost.update.command';
import { Post } from '../Post';

export const handleChangeTitleOfPost: UpdateHandler<ChangeTitleOfPost, Post> = (
    command: ChangeTitleOfPost,
    aggregate: Post
): CommandEvent[] => {
    return [];
};
