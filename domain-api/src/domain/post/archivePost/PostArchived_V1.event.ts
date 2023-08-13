import { CommandEvent, CommandEventData } from '@root/common';

export enum EventType {
    PostArchived_V1 = 'PostArchived_V1',
}

export interface PostArchivedData_V1 extends CommandEventData {
}

export interface PostArchived_V1 extends CommandEvent<PostArchivedData_V1> {
    type: EventType.PostArchived_V1;
    data: PostArchivedData_V1;
}
