import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    postCreated_v1 = 'post-created.v1',
}

export interface PostCreatedData_v1 extends CommandEventData {
    text: string;
    images: string[];
}

export interface PostCreated_v1 extends CommandEvent<PostCreatedData_v1> {
    type: EventType.postCreated_v1;
    data: PostCreatedData_v1;
}
