import { Id } from '@echo/lib-domain-api';
import { EventType, UserUnsavesPostData_V1, UserUnsavesPost_V1 } from './UserUnsavesPost_V1.event';

export const buildUserUnsavesPostV1 = (id: Id, data: UserUnsavesPostData_V1): UserUnsavesPost_V1 => ({
    id: id,
    type: EventType.UserUnsavesPost_V1,
    data: data,
});
