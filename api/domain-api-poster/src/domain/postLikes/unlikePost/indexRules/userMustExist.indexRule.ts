import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { UnlikePost } from "@root/domain/postLikes/unlikePost/UnlikePost.upsert.command";

export const userMustExist: EvaluateIndexRule<UnlikePost> = async (command: UnlikePost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   