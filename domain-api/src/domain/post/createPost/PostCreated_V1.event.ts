import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    PostCreated_v1 = 'PostCreated_V1',
}

export interface PostCreatedData_v1 extends CommandEventData {
    text: string;
    images: string[];
}

export interface PostCreated_v1 extends CommandEvent {
    type: EventType.PostCreated_v1;
    data: PostCreatedData_v1;
}
