import { DomainEvent } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { PostUnbookmarkedData_V1 } from './PostUnbookmarked_V1.event';

export const evolvePostUnbookmarked_V1 = (aggregate: UserPostBookmarks | undefined, event: DomainEvent<string, PostUnbookmarkedData_V1>): UserPostBookmarks => {
    if(!aggregate) {
        return {
            id: event.aggregateId,
            savedPosts: []
        }
    }
    if(!aggregate.savedPosts.includes(event.data.postId)) {
        return aggregate;
    }
    return {
        id: event.aggregateId,
        savedPosts: aggregate.savedPosts.filter(userId => userId !== event.data.userId)
    }
}