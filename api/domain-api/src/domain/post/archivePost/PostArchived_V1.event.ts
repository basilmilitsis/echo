import { CommandEvent, CommandEventData } from '@echo/lib-domain-api';

export enum EventType {
    // DO NOT EDIT THIS ENUM
    PostArchived_V1 = 'PostArchived_V1',
}

export interface PostArchivedData_V1 extends CommandEventData {
}

export interface PostArchived_V1 extends CommandEvent {
    // DO NOT EDIT THIS INTERFACE
    type: EventType.PostArchived_V1;
    data: PostArchivedData_V1;
}
