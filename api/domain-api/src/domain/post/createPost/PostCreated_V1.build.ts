import { Id } from '@echo/lib-domain-api';
import { EventType, PostCreatedData_V1, PostCreated_V1 } from './PostCreated_V1.event';

export const buildPostCreated_V1 = (id: Id, data: PostCreatedData_V1): PostCreated_V1 => ({
    id: id,
    type: EventType.PostCreated_V1,
    data: data,
});
