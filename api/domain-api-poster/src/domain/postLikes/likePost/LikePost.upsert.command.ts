import { Command, Id } from '@echo/lib-domain-api';

export interface LikePost extends Command {
    userId: Id;
}
