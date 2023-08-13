import { Aggregate } from '../../common/Aggregate';
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
