import { Aggregate, Id } from '@echo/lib-domain-api';

export interface LikesForPost extends Aggregate {
    likedByUsers: Id[];
}
