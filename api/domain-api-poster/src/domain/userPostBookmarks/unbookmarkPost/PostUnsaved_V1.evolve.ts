import { DomainEvent } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { PostUnsavedData_V1 } from './PostUnsaved_V1.event';

export const evolvePostUnsaved_V1 = (aggregate: UserPostBookmarks | undefined, event: DomainEvent<string, PostUnsavedData_V1>): UserPostBookmarks => {
    throw new Error('Not implemented');
}