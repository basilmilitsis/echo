import { CommandEvent } from '@root/common/CommandEvent';
import { CreatePost } from './CreatePost.create.command';
import { buildPostCreated_v1 } from './PostCreated_V1.build';
import { CommandEventData, CreateHandler } from '@root/common';

export const handleCreatePost: CreateHandler<CreatePost> = (command: CreatePost): CommandEvent[] => {
    return [
        buildPostCreated_v1(command.id, {
            text: command.text,
            images: command.images,
        }),
    ];
};
