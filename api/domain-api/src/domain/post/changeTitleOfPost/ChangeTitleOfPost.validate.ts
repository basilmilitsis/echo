import { Validator } from "domain-api-base";
import { ChangeTitleOfPost } from "./ChangeTitleOfPost.update.command";

export const validateChangeTitleOfPost: Validator<ChangeTitleOfPost> = (command: ChangeTitleOfPost): string[] => {
    return [];
} 