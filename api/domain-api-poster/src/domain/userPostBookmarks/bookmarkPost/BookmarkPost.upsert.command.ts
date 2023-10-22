import { Command, Id } from '@echo/lib-domain-api';

export interface BookmarkPost extends Command {
    postId: Id;
}
