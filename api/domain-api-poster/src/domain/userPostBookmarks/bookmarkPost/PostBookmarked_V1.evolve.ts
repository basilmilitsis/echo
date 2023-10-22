import { DomainEvent } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { PostBookmarkedData_V1 } from './PostBookmarked_V1.event';

export const evolvePostBookmarked_V1 = (aggregate: UserPostBookmarks | undefined, event: DomainEvent<string, PostBookmarkedData_V1>): UserPostBookmarks => {
    if(!aggregate) {
        return {
            id: event.aggregateId,
            savedPosts: [event.data.postId]
        }
    }

    if(aggregate.savedPosts.includes(event.data.postId)) {
        return aggregate;
    }

    return {
        id: event.aggregateId,
        savedPosts: [...aggregate.savedPosts, event.data.postId]
    }
}