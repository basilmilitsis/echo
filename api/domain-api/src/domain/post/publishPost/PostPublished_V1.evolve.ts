import { DomainEvent, AggregateUpdateEventEvolver } from 'domain-api-base';
import { Post } from '../Post';
import { PostPublishedData_V1 } from './PostPublished_V1.event';

export const evolvePostPublished_V1: AggregateUpdateEventEvolver<Post> = (
    post: Post,
    event: DomainEvent<string, PostPublishedData_V1>
): Post => ({
    ...post,
    state: 'published',
});