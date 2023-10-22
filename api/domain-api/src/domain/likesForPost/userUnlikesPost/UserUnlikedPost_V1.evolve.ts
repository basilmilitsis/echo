import { DomainEvent } from '@echo/lib-domain-api';
import { LikesForPost } from '../LikesForPost';
import { UserUnlikedPostData_V1 } from './UserUnlikedPost_V1.event';

export const evolveUserUnlikedPost_V1 = (aggregate: LikesForPost | undefined, event: DomainEvent<string, UserUnlikedPostData_V1>): LikesForPost => {
    if(!aggregate) {
        return {
            id: event.aggregateId,
            likedByUsers: []
        }
    }
    if(!aggregate.likedByUsers.includes(event.data.userId)) {
        return aggregate;
    }
    return {
        id: event.aggregateId,
        likedByUsers: aggregate.likedByUsers.filter(userId => userId !== event.data.userId)
    }
}