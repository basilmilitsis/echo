import { CommandEvent, UpdateHandler } from '@echo/lib-domain-api';
import { ArchivePost } from './ArchivePost.update.command';
import { Post } from '../Post';
import { buildPostArchivedV1 } from './PostArchived_V1.build';

export const handleArchivePost: UpdateHandler<ArchivePost, Post> = (
    command: ArchivePost,
    aggregate: Post
): CommandEvent[] => {
    if (aggregate.state == 'published') {
        return [buildPostArchivedV1(aggregate.id, {})];
    }

    return [];
};
