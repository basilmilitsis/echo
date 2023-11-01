import { EventStream, EvaluateCommandIndexRule } from "@echo/lib-domain-api";
import { LikePost } from "@root/domain/postLikes/likePost/LikePost.upsert.command";

export const postMustExist: EvaluateCommandIndexRule<LikePost> = async (command: LikePost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   