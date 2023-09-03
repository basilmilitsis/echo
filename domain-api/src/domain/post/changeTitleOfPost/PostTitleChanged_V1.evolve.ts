import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { isPostTitleChanged_V1 } from './PostTitleChanged_V1.is';
import { PostTitleChangedData_V1 } from './PostTitleChanged_V1.event';

export const evolvePostTitleChanged_V1 = (post: Post, event: DomainEvent<string>): Post => {

    if(!isPostTitleChanged_V1(event)) {
        throw new Error('Invalid event type');
    }

    return {
        ...post,
        text: event.data.text,
    };
};
