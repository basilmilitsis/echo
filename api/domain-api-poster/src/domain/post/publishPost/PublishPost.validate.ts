import { ValidateCommand } from "@echo/lib-domain-api";
import { PublishPost } from './PublishPost.update.command';

export const validatePublishPost: ValidateCommand<PublishPost> = (command: PublishPost): string[] => {
    return [];
} 