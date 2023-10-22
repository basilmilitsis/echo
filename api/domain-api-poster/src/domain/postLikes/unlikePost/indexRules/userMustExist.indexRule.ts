import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { UnlikePost } from "@root/domain/postLikes/unlikePost/UnlikePost.upsert.command";

export const userMustExist: CommandIndexRule<UnlikePost> = async (command: UnlikePost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   