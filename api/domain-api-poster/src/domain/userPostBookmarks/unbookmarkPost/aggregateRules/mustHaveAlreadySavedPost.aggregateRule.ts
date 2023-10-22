import { CommandAggregateRule } from "@echo/lib-domain-api";
import { UserPostBookmarks } from "@root/domain/userPostBookmarks/UserPostBookmarks";
import { UnbookmarkPost } from "@root/domain/userPostBookmarks/unbookmarkPost/UnbookmarkPost.upsert.command";

export const mustHaveAlreadySavedPost: CommandAggregateRule<UnbookmarkPost, UserPostBookmarks> = (command: UnbookmarkPost, aggregate: UserPostBookmarks): string[] => {
    return [];
} 