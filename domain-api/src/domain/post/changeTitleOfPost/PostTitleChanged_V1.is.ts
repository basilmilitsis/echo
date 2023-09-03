import { DomainEvent } from '@root/common';
import { EventType, PostTitleChangedData_V1 } from './PostTitleChanged_V1.event';

export const isPostTitleChanged_V1 = (
    event: DomainEvent<string>
): event is DomainEvent<string, PostTitleChangedData_V1> => {
    return event.type === EventType.PostTitleChanged_V1;
};
