import { Validator } from "domain-api-base";
import { CreatePost } from "./CreatePost.create.command";

export const validateCreatePost: Validator<CreatePost> = (command: CreatePost): string[] => {
    if(command.text === '') {
        return ['Text not supplied']
    }
    return [];
} 