import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostCreated_v1 } from './PostCreated_V1.is';

export const evolvePostCreated_V1 = (post: Post | undefined, event: DomainEvent<string, unknown>): Post | undefined => {
    if (isPostCreated_v1(event)) {
        return {
            id: event.id,
            state: 'unpublished',
            text: event.data.text,
            images: event.data.images,
            stats: undefined,
        };
    }
    return undefined;
};
