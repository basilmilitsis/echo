import { ValidateCommand } from "@echo/lib-domain-api";
import { UnbookmarkPost } from './UnbookmarkPost.upsert.command';

export const validateUnbookmarkPost: ValidateCommand<UnbookmarkPost> = (command: UnbookmarkPost): string[] => {
    return [];
} 