import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostPublished_V1 } from './PostPublished_V1.is';
import { AggregateUpdateEventEvolver } from '@root/common/evolve';

export const evolvePostPublished_V1: AggregateUpdateEventEvolver<Post> = (post: Post, event: DomainEvent<string>): Post => {
    return {
        ...post,
        state: 'published'
    }
};
