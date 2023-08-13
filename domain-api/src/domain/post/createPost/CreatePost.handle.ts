import { CommandEvent } from '@root/common/CommandEvent';
import { CreatePost } from './CreatePost.command';
import { buildPostCreated_v1 } from './PostCreated_V1.build';
import { CommandEventData, Handler } from '@root/common';
import { Post } from '../Post';

export const handleCreatePost: Handler<CreatePost, Post, CommandEventData> = (
    command: CreatePost,
    aggregate: Post | undefined
): CommandEvent<CommandEventData>[] => {
    return [
        buildPostCreated_v1(command.id, {
            text: command.text,
            images: command.images,
        }),
    ];
};
