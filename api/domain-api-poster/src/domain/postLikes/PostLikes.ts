import { Aggregate, Id } from '@echo/lib-domain-api';

export interface PostLikes extends Aggregate {
    likedByUsers: Id[];
}
