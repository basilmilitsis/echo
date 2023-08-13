import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    PostPublished_V1 = 'PostPublished_V1',
}

export interface PostPublishedData_V1 extends CommandEventData {
}

export interface PostPublished_V1 extends CommandEvent<PostPublishedData_V1> {
    type: EventType.PostPublished_V1;
    data: PostPublishedData_V1;
}
