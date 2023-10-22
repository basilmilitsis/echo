import { DomainEvent } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostPublishedData_V1 } from './PostPublished_V1.event';

export const evolvePostPublished_V1 = (aggregate: Post, event: DomainEvent<string, PostPublishedData_V1>): Post => ({
    ...aggregate,
    state: 'published',
});
