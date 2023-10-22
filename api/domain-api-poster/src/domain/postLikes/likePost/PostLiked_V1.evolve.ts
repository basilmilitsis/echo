import { DomainEvent } from '@echo/lib-domain-api';
import { PostLikes } from '../PostLikes';
import { PostLikedData_V1 } from './PostLiked_V1.event';

export const evolvePostLiked_V1 = (aggregate: PostLikes | undefined, event: DomainEvent<string, PostLikedData_V1>): PostLikes => {
    if(!aggregate) {
        return {
            id: event.aggregateId,
            likedByUsers: [event.data.userId]
        }
    }

    if(aggregate.likedByUsers.includes(event.data.userId)) {
        return aggregate;
    }

    return {
        id: event.aggregateId,
        likedByUsers: [...aggregate.likedByUsers, event.data.userId]
    }
}