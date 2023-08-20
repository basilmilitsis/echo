import { EventStream } from "./EventStream";

export type CommandContext = {
    eventStream: EventStream;
    generateUuid: () => string;
}