import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { LikePost } from "@root/domain/postLikes/likePost/LikePost.upsert.command";

export const postMustExist: EvaluateIndexRule<LikePost> = async (command: LikePost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   