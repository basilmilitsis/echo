import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { BookmarkPost } from "@root/domain/userPostBookmarks/bookmarkPost/BookmarkPost.upsert.command";

export const postMustExist: EvaluateIndexRule<BookmarkPost> = async (command: BookmarkPost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   