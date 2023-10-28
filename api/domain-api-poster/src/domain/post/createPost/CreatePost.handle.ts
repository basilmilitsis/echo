import { CommandContext, CommandEvent, CommandMetadata, HandleCreateCommand } from '@echo/lib-domain-api';
import { CreatePost } from './CreatePost.create.command';
import { buildPostCreated_V1 } from './PostCreated_V1.event';

export const handleCreatePost: HandleCreateCommand<CreatePost> = (
    command: CreatePost,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [
        buildPostCreated_V1(command.id, {
            text: command.text,
            images: command.images,
        }),
    ];
};
