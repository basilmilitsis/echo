import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { UnbookmarkPost } from "@root/domain/userPostBookmarks/unbookmarkPost/UnbookmarkPost.upsert.command";

export const postMustExist: CommandIndexRule<UnbookmarkPost> = async (command: UnbookmarkPost, eventStream: EventStream): Promise<string[]> => {
    return [];
}   