import { CommandEvent, UpdateHandler } from 'domain-api-base';
import { PublishPost } from './PublishPost.update.command';
import { Post } from '../Post';
import { buildPostPublishedV1 } from './PostPublished_V1.build';

export const handlePublishPost: UpdateHandler<PublishPost, Post> = 
(
    command: PublishPost,
    aggregate: Post
): CommandEvent[] => {
    if (aggregate?.state == 'unpublished') {
        return [buildPostPublishedV1(aggregate.id, {})];
    }

    return [];
};
