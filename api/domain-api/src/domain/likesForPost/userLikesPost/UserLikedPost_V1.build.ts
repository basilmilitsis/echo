import { Id } from '@echo/lib-domain-api';
import { EventType, UserLikedPostData_V1, UserLikedPost_V1 } from './UserLikedPost_V1.event';

export const buildUserLikedPostV1 = (id: Id, data: UserLikedPostData_V1): UserLikedPost_V1 => ({
    id: id,
    type: EventType.UserLikedPost_V1,
    data: data,
});
