import { EvaluateCommandAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { ArchivePost } from "@root/domain/post/archivePost/ArchivePost.update.command";

export const postMustNotBeArchived: EvaluateCommandAggregateRule<ArchivePost, Post> = (command: ArchivePost, aggregate: Post): string[] => {
    if(aggregate.state !==  "archived") {
        return ['Post is already archived']
    }
    return [];
} 