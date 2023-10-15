import { CommandEvent, CreateHandler } from '@echo/lib-domain-api';
import { CreatePost } from './CreatePost.create.command';
import { buildPostCreated_V1 } from './PostCreated_V1.build';

export const handleCreatePost: CreateHandler<CreatePost> = (command: CreatePost): CommandEvent[] => {
    return [
        buildPostCreated_V1(command.id, {
            text: command.text,
            images: command.images,
        }),
    ];
};
