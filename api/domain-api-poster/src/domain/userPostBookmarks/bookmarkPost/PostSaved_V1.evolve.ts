import { DomainEvent } from '@echo/lib-domain-api';
import { UserPostBookmarks } from '../UserPostBookmarks';
import { PostSavedData_V1 } from './PostSaved_V1.event';

export const evolvePostSaved_V1 = (aggregate: UserPostBookmarks | undefined, event: DomainEvent<string, PostSavedData_V1>): UserPostBookmarks => {
    if (!aggregate) {
        return {
            id: event.aggregateId,
            postsSaved: [event.data.postId],
        };
    }

    if (aggregate.postsSaved.includes(event.data.postId)) {
        return aggregate;
    }

    return {
        id: event.aggregateId,
        postsSaved: [...aggregate.postsSaved, event.data.postId],
    };
}