import { Aggregate, Id } from '@echo/lib-domain-api';

export interface PostSavesForUser extends Aggregate {
    postsSaved: Id[];
}
