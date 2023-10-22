import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { ChangeTitleOfPost } from './ChangeTitleOfPost.update.command';
import { Post } from '../Post';

export const handleChangeTitleOfPost: HandleUpdateCommand<ChangeTitleOfPost, Post> = (
    command: ChangeTitleOfPost,
    aggregate: Post
): CommandEvent[] => {
    return [];
};
