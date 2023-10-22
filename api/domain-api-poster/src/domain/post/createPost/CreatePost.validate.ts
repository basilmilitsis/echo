import { ValidateCommand } from "@echo/lib-domain-api";
import { CreatePost } from './CreatePost.create.command';

export const validateCreatePost: ValidateCommand<CreatePost> = (command: CreatePost): string[] => {
    if(command.text === '') {
        return ['Text not supplied']
    }
    return [];
} 