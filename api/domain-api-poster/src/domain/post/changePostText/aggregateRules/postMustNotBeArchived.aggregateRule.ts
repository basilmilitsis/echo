import { EvaluateUpdateAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { ChangePostText } from "@root/domain/post/changePostText/ChangePostText.update.command";

export const postMustNotBeArchived: EvaluateUpdateAggregateRule<ChangePostText, Post> = (command: ChangePostText, aggregate: Post): string[] => {
    if(aggregate.state ===  "archived") {
        return ['Archived posts cannot be edited']
    }
    return [];
} 