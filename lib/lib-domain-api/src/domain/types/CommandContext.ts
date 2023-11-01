import { Logger } from "@echo/lib-common";
import { EventStream } from "./EventStream";

export type CommandContext = {
    eventStream: EventStream;
    generateUuid: () => string;
    logger: Logger;
}