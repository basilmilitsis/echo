import { CommandAggregateAuthRule, CommandMetadata } from '@echo/lib-domain-api';
import { Post } from '@root/domain/post/Post';
import { PublishPost } from '@root/domain/post/publishPost/PublishPost.update.command';

export const mustBeOwnPost: CommandAggregateAuthRule<PublishPost, Post> = (
    command: PublishPost,
    aggregate: Post,
    metadata: CommandMetadata
): string[] => {
    if (metadata.credentials?.id !== aggregate.authorId) {
        return ['Not authorized to publish this post'];
    }
    return [];
};
