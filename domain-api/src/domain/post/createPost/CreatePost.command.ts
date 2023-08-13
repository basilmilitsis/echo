import { Command } from '@root/common/Command';

export interface CreatePost extends Command {
    text: string;
    images: string[];
}
