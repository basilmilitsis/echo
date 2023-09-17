import { Aggregate } from 'domain-api-base';
import { PostState } from './types';

export interface Post extends Aggregate {
    text: string;
    images: string[];

    state: PostState;

    stats: {
        saved: number;
        liked: number;
        shared: number;
    };
}
