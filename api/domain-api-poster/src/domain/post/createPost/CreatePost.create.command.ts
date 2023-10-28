import { Command, Id } from '@echo/lib-domain-api';

export interface CreatePost extends Command {
    userId: Id;
    text: string;
    images: string[];
}
