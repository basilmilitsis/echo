import { Command } from '@echo/lib-domain-api';

export interface UnlikePost extends Command {
    userId: string;
}
