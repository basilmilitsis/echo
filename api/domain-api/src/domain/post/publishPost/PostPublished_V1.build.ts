import { Id } from '@echo/lib-domain-api';
import { EventType, PostPublishedData_V1, PostPublished_V1 } from './PostPublished_V1.event';

export const buildPostPublishedV1 = (id: Id, data: PostPublishedData_V1): PostPublished_V1 => ({
    id: id,
    type: EventType.PostPublished_V1,
    data: data,
});
