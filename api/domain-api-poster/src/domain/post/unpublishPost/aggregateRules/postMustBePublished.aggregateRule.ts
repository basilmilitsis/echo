import { EvaluateCommandAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { UnpublishPost } from "@root/domain/post/unpublishPost/UnpublishPost.update.command";

export const postMustBePublished: EvaluateCommandAggregateRule<UnpublishPost, Post> = (command: UnpublishPost, aggregate: Post): string[] => {
    if(aggregate.state !==  "published") {
        return ['Post must be published']
    }
    return [];
} 