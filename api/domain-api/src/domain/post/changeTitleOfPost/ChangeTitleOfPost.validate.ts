import { ValidateCommand } from "@echo/lib-domain-api";
import { ChangeTitleOfPost } from "./ChangeTitleOfPost.update.command";

export const validateChangeTitleOfPost: ValidateCommand<ChangeTitleOfPost> = (command: ChangeTitleOfPost): string[] => {
    return [];
} 