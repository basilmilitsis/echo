import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { LikePost } from "@root/domain/postLikes/likePost/LikePost.upsert.command";

export const userMustExist: CommandIndexRule<LikePost> = async (command: LikePost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   