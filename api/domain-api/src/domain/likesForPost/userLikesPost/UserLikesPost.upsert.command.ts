import { Command, Id } from '@echo/lib-domain-api';

export interface UserLikesPost extends Command {
    userId: Id;
}
