import { Id } from "./types";

export type CommandEventData = Record<string, string | string[] | number>

export interface CommandEvent {
    id: Id;
    type: string;
    data: CommandEventData;
}
