import { Validator } from "@echo/lib-domain-api";
import { ArchivePost } from "./ArchivePost.update.command";

export const validateArchivePost: Validator<ArchivePost> = (command: ArchivePost): string[] => {
    return [];
} 