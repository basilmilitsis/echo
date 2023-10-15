import { DomainEvent, AggregateUpdateEventEvolver } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostPublishedData_V1 } from './PostPublished_V1.event';

export const evolvePostPublished_V1: AggregateUpdateEventEvolver<Post> = (
    post: Post,
    event: DomainEvent<string, PostPublishedData_V1>
): Post => ({
    ...post,
    state: 'published',
});
