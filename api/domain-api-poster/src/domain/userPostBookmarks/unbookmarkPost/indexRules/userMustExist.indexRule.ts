import { EventStream, EvaluateCommandIndexRule } from "@echo/lib-domain-api";
import { UnbookmarkPost } from "@root/domain/userPostBookmarks/unbookmarkPost/UnbookmarkPost.upsert.command";

export const userMustExist: EvaluateCommandIndexRule<UnbookmarkPost> = async (command: UnbookmarkPost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   