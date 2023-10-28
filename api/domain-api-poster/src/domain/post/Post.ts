import { Aggregate, Id } from '@echo/lib-domain-api';
import { PostState } from './types';

export interface Post extends Aggregate {
    authorId: Id;
    text: string;
    images: string[];

    state: PostState;
}
