import { DomainEvent } from '@root/common';
import { Post } from '../Post';
import { PostTitleChangedData_V1 } from './PostTitleChanged_V1.event';

export const evolvePostTitleChanged_V1 = (post: Post, event: DomainEvent<string, PostTitleChangedData_V1>): Post => ({
    ...post,
    text: event.data.text,
});
