import { DomainEvent } from '@echo/lib-domain-api';
import { PostLikes } from '../PostLikes';
import { PostUnlikedData_V1 } from './PostUnliked_V1.event';

export const evolvePostUnliked_V1 = (aggregate: PostLikes | undefined, event: DomainEvent<string, PostUnlikedData_V1>): PostLikes => {
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