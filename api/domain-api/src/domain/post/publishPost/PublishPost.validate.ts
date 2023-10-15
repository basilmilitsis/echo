import { Validator } from "@echo/lib-domain-api";
import { PublishPost } from "./PublishPost.update.command";

export const validatePublishPost: Validator<PublishPost> = (command: PublishPost): string[] => {
    return [];
} 