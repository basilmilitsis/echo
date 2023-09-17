import { EventStream, CommandIndexRule } from "domain-api-base";
import { CreatePost } from "../CreatePost.create.command";

export const postCannotAlreadyExist: CommandIndexRule<CreatePost> = async (command: CreatePost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('Post', command.id);
    if(streamEvents.length > 0) {
        return ['Stream already exists'];
    }
    return [];
}   