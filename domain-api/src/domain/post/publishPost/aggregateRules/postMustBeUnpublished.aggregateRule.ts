import { CommandAggregateRule } from "@root/common/CommandAggregateRule";
import { Post } from "../../Post";
import { PublishPost } from "../PublishPost.update.command";

export const postMustBeUnpublished: CommandAggregateRule<PublishPost, Post> = (command: PublishPost, aggregate: Post): string[] => {
    if(aggregate.state ===  "published" || aggregate.state ===  "archived") {
        return ['Post must be unpublished']
    }
    return [];
} 