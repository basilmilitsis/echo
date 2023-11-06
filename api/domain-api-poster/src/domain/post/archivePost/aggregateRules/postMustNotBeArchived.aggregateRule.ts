import { EvaluateUpdateAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { ArchivePost } from "@root/domain/post/archivePost/ArchivePost.update.command";

export const postMustNotBeArchived: EvaluateUpdateAggregateRule<ArchivePost, Post> = (command: ArchivePost, aggregate: Post): string[] => {
    if(aggregate.state !==  "archived") {
        return ['Post is already archived']
    }
    return [];
} 