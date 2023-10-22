import { CommandEvent, CommandEventData, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserUnlikedPost_V1 = 'UserUnlikedPost_V1',
}

export interface UserUnlikedPostData_V1 extends CommandEventData {
    userId: Id;
}

export interface UserUnlikedPost_V1 extends CommandEvent {
    type: EventType.UserUnlikedPost_V1;
    data: UserUnlikedPostData_V1;
}
