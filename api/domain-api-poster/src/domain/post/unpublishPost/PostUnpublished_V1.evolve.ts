import { DomainEvent } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostUnpublishedData_V1 } from './PostUnpublished_V1.event';

export const evolvePostUnpublished_V1 = (aggregate: Post, event: DomainEvent<string, PostUnpublishedData_V1>): Post => {
    throw new Error('Not implemented');
}