import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    PostCreated_V1 = 'PostCreated_V1',
}

export interface PostCreatedData_V1 extends CommandEventData {
    text: string;
    images: string[];
}

export interface PostCreated_V1 extends CommandEvent {
    type: EventType.PostCreated_V1;
    data: PostCreatedData_V1;
}
