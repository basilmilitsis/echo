import { CommandAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { PublishPost } from "@root/domain/post/publishPost/PublishPost.update.command";

export const postMustBeOwnedByUser: CommandAggregateRule<PublishPost, Post> = (command: PublishPost, aggregate: Post): string[] => {
    // TODO
    return [];
} 