import { DomainEvent } from '@echo/lib-domain-api';
import { EventType, UserUnsavesPostData_V1 } from './UserUnsavesPost_V1.event';

export const isUserUnsavesPost_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, UserUnsavesPostData_V1> => {
    return event.type === EventType.UserUnsavesPost_V1;
};
