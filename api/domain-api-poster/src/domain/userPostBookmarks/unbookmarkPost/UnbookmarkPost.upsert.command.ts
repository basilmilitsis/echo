import { Command, Id } from '@echo/lib-domain-api';

export interface UnbookmarkPost extends Command {
    postId: Id;
}
