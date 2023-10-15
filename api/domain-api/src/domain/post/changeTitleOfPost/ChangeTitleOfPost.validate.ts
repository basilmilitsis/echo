import { Validator } from "@echo/lib-domain-api";
import { ChangeTitleOfPost } from "./ChangeTitleOfPost.update.command";

export const validateChangeTitleOfPost: Validator<ChangeTitleOfPost> = (command: ChangeTitleOfPost): string[] => {
    return [];
} 