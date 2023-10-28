import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { CreatePost } from "@root/domain/post/createPost/CreatePost.create.command";

export const userMustExist: CommandIndexRule<CreatePost> = async (command: CreatePost, eventStream: EventStream): Promise<string[]> => {
    const events = await eventStream.findEvents('UserProfile', command.userId);
    if(events.length === 0) {
        return ['User does not exist'];
    }
    return [];
}   