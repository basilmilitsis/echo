import { DomainEvent } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostArchivedData_V1 } from './PostArchived_V1.event';

export const evolvePostArchived_V1 = (aggregate: Post, event: DomainEvent<string, PostArchivedData_V1>): Post => ({
    ...aggregate,
    state: 'archived',
});
