import { Aggregate, Id } from '@echo/lib-domain-api';

export interface UserPostBookmarks extends Aggregate {
    savedPosts: Id[];
}
