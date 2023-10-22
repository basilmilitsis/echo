import { DomainEvent } from '@echo/lib-domain-api';
import { PostSavesForUser } from '../PostSavesForUser';
import { UserUnsavesPostData_V1 } from './UserUnsavesPost_V1.event';

export const evolveUserUnsavesPost_V1 = (aggregate: PostSavesForUser | undefined, event: DomainEvent<string, UserUnsavesPostData_V1>): PostSavesForUser => {
    if(!aggregate) {
        return {
            id: event.aggregateId,
            postsSaved: []
        }
    }
    if(!aggregate.postsSaved.includes(event.data.postId)) {
        return aggregate;
    }
    return {
        id: event.aggregateId,
        postsSaved: aggregate.postsSaved.filter(postId => postId !== event.data.postId)
    }
}