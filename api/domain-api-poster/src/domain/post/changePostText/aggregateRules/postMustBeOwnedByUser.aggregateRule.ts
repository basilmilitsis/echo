import { EvaluateUpdateAggregateRule } from "@echo/lib-domain-api";
import { Post } from "@root/domain/post/Post";
import { ChangePostText } from "@root/domain/post/changePostText/ChangePostText.update.command";

export const postMustBeOwnedByUser: EvaluateUpdateAggregateRule<ChangePostText, Post> = (command: ChangePostText, aggregate: Post): string[] => {
    // TODO
    return [];
} 