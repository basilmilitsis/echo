import { CommandAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { ArchivePost } from "@root/domain/post/archivePost/ArchivePost.update.command";

export const postMustNotBeArchived: CommandAggregateRule<ArchivePost, Post> = (command: ArchivePost, aggregate: Post): string[] => {
    return [];
} 