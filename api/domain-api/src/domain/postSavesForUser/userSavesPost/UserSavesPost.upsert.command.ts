import { Command, Id } from '@echo/lib-domain-api';

export interface UserSavesPost extends Command {
    postId: Id;
}
