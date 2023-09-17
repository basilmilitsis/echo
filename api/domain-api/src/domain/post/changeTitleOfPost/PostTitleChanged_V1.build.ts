import { Id } from 'domain-api-base';
import { EventType, PostTitleChangedData_V1, PostTitleChanged_V1 } from './PostTitleChanged_V1.event';

export const buildPostTitleChangedV1 = (id: Id, data: PostTitleChangedData_V1): PostTitleChanged_V1 => ({
    id: id,
    type: EventType.PostTitleChanged_V1,
    data: data,
});
