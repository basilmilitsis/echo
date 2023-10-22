import { Command, Id } from '@echo/lib-domain-api';

export interface UserUnsavesPost extends Command {
    postId: Id;
}
