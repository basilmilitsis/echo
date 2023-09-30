import { Id } from 'domain-api-base';
import { EventType, PostArchivedData_V1, PostArchived_V1 } from './PostArchived_V1.event';

export const buildPostArchivedV1 = (id: Id, data: PostArchivedData_V1): PostArchived_V1 => ({
    id: id,
    type: EventType.PostArchived_V1,
    data: data,
});