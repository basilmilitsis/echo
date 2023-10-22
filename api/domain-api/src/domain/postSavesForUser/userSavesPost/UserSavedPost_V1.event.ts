import { CommandEvent, CommandEventData, Id } from '@echo/lib-domain-api';

export enum EventType {
    UserSavedPost_V1 = 'UserSavedPost_V1',
}

export interface UserSavedPostData_V1 extends CommandEventData {
    postId: Id;
}

export interface UserSavedPost_V1 extends CommandEvent {
    type: EventType.UserSavedPost_V1;
    data: UserSavedPostData_V1;
}
