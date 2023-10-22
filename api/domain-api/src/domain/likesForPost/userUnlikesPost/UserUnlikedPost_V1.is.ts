import { DomainEvent } from '@echo/lib-domain-api';
import { EventType, UserUnlikedPostData_V1 } from './UserUnlikedPost_V1.event';

export const isUserUnlikedPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserUnlikedPostData_V1> => {
    return event.type === EventType.UserUnlikedPost_V1;
};
