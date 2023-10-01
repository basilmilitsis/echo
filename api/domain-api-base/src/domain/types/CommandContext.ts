import { DomainLogger } from "../DomainLogger";
import { EventStream } from "./EventStream";

export type CommandContext = {
    eventStream: EventStream;
    generateUuid: () => string;
    logger: DomainLogger;
}