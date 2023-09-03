import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostArchived_V1 } from './PostArchived_V1.is';
import { PostArchivedData_V1 } from './PostArchived_V1.event';

export const evolvePostArchived_V1 = (post: Post, event: DomainEvent<string>): Post => {
    return {
        ...post,
        state: 'archived',
    };
};
