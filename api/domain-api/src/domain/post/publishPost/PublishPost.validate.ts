import { Validator } from "domain-api-base";
import { PublishPost } from "./PublishPost.update.command";

export const validatePublishPost: Validator<PublishPost> = (command: PublishPost): string[] => {
    return [];
} 