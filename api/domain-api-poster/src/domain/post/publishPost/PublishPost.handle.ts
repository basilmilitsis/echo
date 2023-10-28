import { CommandContext, CommandEvent, CommandMetadata, HandleUpdateCommand } from '@echo/lib-domain-api';
import { PublishPost } from './PublishPost.update.command';
import { Post } from '../Post';
import { buildPostPublished_V1 } from './PostPublished_V1.event';

export const handlePublishPost: HandleUpdateCommand<PublishPost, Post> = (
    command: PublishPost,
    aggregate: Post,
    metadata: CommandMetadata,
    context: CommandContext
): CommandEvent[] => {
    if (aggregate?.state == 'unpublished') {
        return [buildPostPublished_V1(aggregate.id, {})];
    }

    return [];
};
