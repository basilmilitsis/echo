import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostPublished_V1 } from './PostPublished_V1.is';

export const evolvePostPublished_V1 = (post: Post | undefined, event: DomainEvent<string, unknown>): Post | undefined => {
    if (isPostPublished_V1(event)) {
        return {
            ...post,
            state: 'published'
        }
    }
    return undefined;
};
