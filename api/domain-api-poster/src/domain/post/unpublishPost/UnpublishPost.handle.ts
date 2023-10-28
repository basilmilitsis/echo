import { CommandContext, CommandEvent, CommandMetadata, HandleUpdateCommand } from '@echo/lib-domain-api';
import { UnpublishPost } from './UnpublishPost.update.command';
import { Post } from '../Post';

export const handleUnpublishPost: HandleUpdateCommand<UnpublishPost, Post> = (
    command: UnpublishPost,
    aggregate: Post,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    return [];
};
