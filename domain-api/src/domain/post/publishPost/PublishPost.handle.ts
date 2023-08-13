import { CommandEvent, CommandEventData, Handler } from '@root/common';
import { PublishPost } from './PublishPost.command';
import { Post } from '../Post';
import { buildPostPublishedV1 } from './PostPublished_v1.build';

export const handlePublishPost: Handler<PublishPost, Post, CommandEventData> = (
    command: PublishPost,
    aggregate: Post | undefined
): CommandEvent<CommandEventData>[] => {
    if (aggregate.state == 'unpublished') {
        return [buildPostPublishedV1(aggregate.id, {})];
    }

    return [];
};
