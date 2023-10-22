import { DomainEvent } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostTitleChangedData_V1 } from './PostTitleChanged_V1.event';

export const evolvePostTitleChanged_V1 = (aggregate: Post, event: DomainEvent<string, PostTitleChangedData_V1>): Post => {
    throw new Error('Not implemented');
}