import { DomainEvent } from '@echo/lib-domain-api';
import { LikesForPost } from '../LikesForPost';
import { UserLikedPostData_V1 } from './UserLikedPost_V1.event';

export const evolveUserLikedPost_V1 = (aggregate: LikesForPost | undefined, event: DomainEvent<string, UserLikedPostData_V1>): LikesForPost => {
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