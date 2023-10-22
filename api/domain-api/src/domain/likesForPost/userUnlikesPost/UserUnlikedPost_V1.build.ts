import { Id } from '@echo/lib-domain-api';
import { EventType, UserUnlikedPostData_V1, UserUnlikedPost_V1 } from './UserUnlikedPost_V1.event';

export const buildUserUnlikedPostV1 = (id: Id, data: UserUnlikedPostData_V1): UserUnlikedPost_V1 => ({
    id: id,
    type: EventType.UserUnlikedPost_V1,
    data: data,
});
