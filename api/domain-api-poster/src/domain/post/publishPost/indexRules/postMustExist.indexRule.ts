import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { PublishPost } from "@root/domain/post/publishPost/PublishPost.update.command";

export const postMustExist: CommandIndexRule<PublishPost> = async (command: PublishPost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   