import { Aggregate } from '@echo/lib-domain-api';
import { PostState } from './types';

export interface Post extends Aggregate {
    text: string;
    images: string[];

    state: PostState;
}
