import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { CreatePost } from "@root/domain/post/createPost/CreatePost.create.command";

export const userMustExist: CommandIndexRule<CreatePost> = async (command: CreatePost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   