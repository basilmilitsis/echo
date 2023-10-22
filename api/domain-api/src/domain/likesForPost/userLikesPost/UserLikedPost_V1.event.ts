import { CommandEvent, CommandEventData, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserLikedPost_V1 = 'UserLikedPost_V1',
}

export interface UserLikedPostData_V1 extends CommandEventData {
    userId: Id;
}

export interface UserLikedPost_V1 extends CommandEvent {
    type: EventType.UserLikedPost_V1;
    data: UserLikedPostData_V1;
}
