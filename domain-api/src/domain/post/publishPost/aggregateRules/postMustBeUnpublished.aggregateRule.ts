import { CommandAggregateRule } from "@root/common/CommandAggregateRule";
import { CreatePost } from "../../createPost/CreatePost.create.command";
import { Post } from "../../Post";

export const postMustBeUnpublished: CommandAggregateRule<CreatePost, Post> = (command: CreatePost, aggregate: Post): string[] => {
    if(aggregate.state ===  "published" || aggregate.state ===  "archived") {
        return ['Post must be unpublished']
    }
    return [];
} 