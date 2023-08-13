import { Id } from '@root/common';
import { EventType, PostCreatedData_v1, PostCreated_v1 } from './PostCreated_V1.event';

export const buildPostCreated_v1 = (id: Id, data: PostCreatedData_v1): PostCreated_v1 => ({
    id: id,
    type: EventType.postCreated_v1,
    data: data,
});
