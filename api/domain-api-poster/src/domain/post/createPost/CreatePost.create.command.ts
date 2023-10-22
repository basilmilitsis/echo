import { Command } from '@echo/lib-domain-api';

export interface CreatePost extends Command {
    text: string;
    images: string[];
}
