import { DomainEvent } from '@echo/lib-domain-api';
import { PostSavesForUser } from '../PostSavesForUser';
import { UserSavedPostData_V1 } from './UserSavedPost_V1.event';

export const evolveUserSavedPost_V1 = (
    aggregate: PostSavesForUser | undefined,
    event: DomainEvent<string, UserSavedPostData_V1>
): PostSavesForUser => {
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
};
