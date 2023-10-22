import { CommandEvent, CommandEventData, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserUnsavesPost_V1 = 'UserUnsavesPost_V1',
}

export interface UserUnsavesPostData_V1 extends CommandEventData {
    postId: Id;
}

export interface UserUnsavesPost_V1 extends CommandEvent {
    type: EventType.UserUnsavesPost_V1;
    data: UserUnsavesPostData_V1;
}
