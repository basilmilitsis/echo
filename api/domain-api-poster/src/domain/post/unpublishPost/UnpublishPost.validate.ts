import { ValidateCommand } from "@echo/lib-domain-api";
import { UnpublishPost } from './UnpublishPost.update.command';

export const validateUnpublishPost: ValidateCommand<UnpublishPost> = (command: UnpublishPost): string[] => {
    //TODO
    return [];
} 