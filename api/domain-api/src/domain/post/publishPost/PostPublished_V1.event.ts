import { CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    PostPublished_V1 = 'PostPublished_V1',
}

export interface PostPublishedData_V1 extends CommandEventData {
}

export interface PostPublished_V1 extends CommandEvent {
    type: EventType.PostPublished_V1;
    data: PostPublishedData_V1;
}
