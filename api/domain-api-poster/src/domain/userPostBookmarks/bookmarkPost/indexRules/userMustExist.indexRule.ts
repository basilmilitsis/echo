import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { BookmarkPost } from "@root/domain/userPostBookmarks/bookmarkPost/BookmarkPost.upsert.command";

export const userMustExist: CommandIndexRule<BookmarkPost> = async (command: BookmarkPost, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   