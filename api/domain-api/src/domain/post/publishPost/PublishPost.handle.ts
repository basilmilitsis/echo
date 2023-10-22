import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { PublishPost } from './PublishPost.update.command';
import { Post } from '../Post';
import { buildPostPublishedV1 } from './PostPublished_V1.event';

export const handlePublishPost: HandleUpdateCommand<PublishPost, Post> = 
(
    command: PublishPost,
    aggregate: Post
): CommandEvent[] => {
    if (aggregate?.state == 'unpublished') {
        return [buildPostPublishedV1(aggregate.id, {})];
    }

    return [];
};
