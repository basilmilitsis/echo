import { Id } from "./types";

export type CommandEventData = Record<string, string | string[] | number>

export interface CommandEvent<D extends CommandEventData = CommandEventData> {
    id: Id;
    type: string;
    data: D;
}
