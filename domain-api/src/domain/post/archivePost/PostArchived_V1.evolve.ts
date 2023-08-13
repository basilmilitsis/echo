import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostArchived_V1 } from './PostArchived_V1.is';

export const evolvePostArchived_V1 = (post: Post | undefined, event: DomainEvent<string, unknown>): Post | undefined => {
    if (isPostArchived_V1(event)) {
        return {
            ...post,
            state: "archived"
        }
    }
    return undefined;
};
