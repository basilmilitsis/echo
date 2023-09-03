import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostCreated_v1 } from './PostCreated_V1.is';

export const evolvePostCreated_V1 = (event: DomainEvent<string>): Post => {
    if(!isPostCreated_v1(event)) {
        throw new Error('Invalid event type');
    }

    return {
        id: event.id,
        state: 'unpublished',
        text: event.data.text,
        images: event.data.images,
        stats: {
            liked: 0,
            saved: 0,
            shared: 0,
        },
    };
};
