import { ValidateCommand } from "@echo/lib-domain-api";
import { ArchivePost } from './ArchivePost.update.command';

export const validateArchivePost: ValidateCommand<ArchivePost> = (command: ArchivePost): string[] => {
    //TODO
    return [];
} 