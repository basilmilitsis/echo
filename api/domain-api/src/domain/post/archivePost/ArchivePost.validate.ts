import { Validator } from "domain-api-base";
import { ArchivePost } from "./ArchivePost.update.command";

export const validateArchivePost: Validator<ArchivePost> = (command: ArchivePost): string[] => {
    return [];
} 