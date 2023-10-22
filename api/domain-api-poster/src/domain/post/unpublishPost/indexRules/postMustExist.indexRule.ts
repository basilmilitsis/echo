import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { UnpublishPost } from "@root/domain/post/unpublishPost/UnpublishPost.update.command";

export const postMustExist: CommandIndexRule<UnpublishPost> = async (command: UnpublishPost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   