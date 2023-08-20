import { CommandRule } from "@root/common";
import { CreatePost } from "../CreatePost.create.command";

export const cannotHaveMoreThan5Images: CommandRule<CreatePost> = (command: CreatePost): string[] => {
    if(command.images.length > 5) {
        return ['Cannot have more than 5 images']
    }
    return [];
} 