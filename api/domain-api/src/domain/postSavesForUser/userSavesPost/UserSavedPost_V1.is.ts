import { DomainEvent } from '@echo/lib-domain-api';
import { EventType, UserSavedPostData_V1 } from './UserSavedPost_V1.event';

export const isUserSavedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserSavedPostData_V1> => {
    return event.type === EventType.UserSavedPost_V1;
};
