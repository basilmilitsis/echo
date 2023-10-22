import { ValidateCommand } from "@echo/lib-domain-api";
import { BookmarkPost } from './BookmarkPost.upsert.command';

export const validateBookmarkPost: ValidateCommand<BookmarkPost> = (command: BookmarkPost): string[] => {
    //TODO
    return [];
} 