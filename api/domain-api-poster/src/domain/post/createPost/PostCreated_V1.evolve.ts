import { DomainEvent } from '@echo/lib-domain-api';
import { Post } from '../Post';
import { PostCreatedData_V1 } from './PostCreated_V1.event';

export const evolvePostCreated_V1 = (event: DomainEvent<string, PostCreatedData_V1>): Post => ({
    id: event.id,
    authorId: event.data.authorId,
    state: 'unpublished',
    text: event.data.text,
    images: event.data.images,
});