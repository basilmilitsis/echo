import { DomainEvent } from 'domain-api-base';
import { Post } from '../Post';
import { PostArchivedData_V1 } from './PostArchived_V1.event';

export const evolvePostArchived_V1 = (post: Post, event: DomainEvent<string, PostArchivedData_V1>): Post => ({
    ...post,
    state: 'archived',
});
