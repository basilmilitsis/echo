import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    PostTitleChanged_V1 = 'PostTitleChanged_V1',
}

export interface PostTitleChangedData_V1 extends CommandEventData {
    text: string
}

export interface PostTitleChanged_V1 extends CommandEvent {
    type: EventType.PostTitleChanged_V1;
    data: PostTitleChangedData_V1;
}
