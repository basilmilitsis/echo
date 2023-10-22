import { Id } from '@echo/lib-domain-api';
import { EventType, UserSavedPostData_V1, UserSavedPost_V1 } from './UserSavedPost_V1.event';

export const buildUserSavedPostV1 = (id: Id, data: UserSavedPostData_V1): UserSavedPost_V1 => ({
    id: id,
    type: EventType.UserSavedPost_V1,
    data: data,
});
