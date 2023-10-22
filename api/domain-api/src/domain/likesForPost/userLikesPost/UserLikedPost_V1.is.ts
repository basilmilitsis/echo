import { DomainEvent } from '@echo/lib-domain-api';
import { EventType, UserLikedPostData_V1 } from './UserLikedPost_V1.event';

export const isUserLikedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserLikedPostData_V1> => {
    return event.type === EventType.UserLikedPost_V1;
};
