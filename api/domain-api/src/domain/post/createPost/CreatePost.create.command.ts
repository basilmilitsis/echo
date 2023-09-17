import { Command } from 'domain-api-base';

export interface CreatePost extends Command {
    text: string;
    images: string[];
}
