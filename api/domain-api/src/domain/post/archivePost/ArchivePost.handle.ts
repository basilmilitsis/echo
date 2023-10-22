import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { ArchivePost } from './ArchivePost.update.command';
import { Post } from '../Post';
import { buildPostArchivedV1 } from './PostArchived_V1.event';

export const handleArchivePost: HandleUpdateCommand<ArchivePost, Post> = (
    command: ArchivePost,
    aggregate: Post
): CommandEvent[] => {
    if (aggregate.state == 'published') {
        return [buildPostArchivedV1(aggregate.id, {})];
    }

    return [];
};
