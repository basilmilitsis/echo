import { CommandEvent, CommandEventData, UpdateHandler } from '@root/common';
import { ArchivePost } from './ArchivePost.update.command';
import { Post } from '../Post';
import { buildPostArchivedV1 } from './PostArchived_v1.build';

export const handleArchivePost: UpdateHandler<ArchivePost, Post, CommandEventData> = (
    command: ArchivePost,
    aggregate: Post | undefined
): CommandEvent<CommandEventData>[] => {
    if (aggregate.state == 'published') {
        return [buildPostArchivedV1(aggregate.id, {})];
    }

    return [];
};
