import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { CreatePost } from "@root/domain/post/createPost/CreatePost.create.command";

export const postMustNotAlreadyExist: EvaluateIndexRule<CreatePost> = async (command: CreatePost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('post', command.id);
    if(streamEvents.length > 0) {
        return ['Post already exists'];
    }
    return [];
}   