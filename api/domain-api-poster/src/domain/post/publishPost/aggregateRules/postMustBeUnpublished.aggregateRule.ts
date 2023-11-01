import { EvaluateCommandAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { PublishPost } from "@root/domain/post/publishPost/PublishPost.update.command";

export const postMustBeUnpublished: EvaluateCommandAggregateRule<PublishPost, Post> = (command: PublishPost, aggregate: Post): string[] => {
    if(aggregate.state !==  "unpublished") {
        return ['Post must be unpublished']
    }
    return [];
} 