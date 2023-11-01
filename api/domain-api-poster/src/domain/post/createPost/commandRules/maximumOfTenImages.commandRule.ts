import { EvaluateCommandRule } from "@echo/lib-domain-api";
import { CreatePost } from "@root/domain/post/createPost/CreatePost.create.command";

export const maximumOfTenImages: EvaluateCommandRule<CreatePost> = (command: CreatePost): string[] => {
    if(command.images.length > 10) {
        return ['Cannot have more than 10 images']
    }
    return [];
} 