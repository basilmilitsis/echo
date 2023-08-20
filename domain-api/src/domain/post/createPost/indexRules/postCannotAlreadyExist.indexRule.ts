import { CommandIndexRule } from "@root/common/CommandIndexRule";
import { CreatePost } from "../CreatePost.create.command";
import { EventStream } from "@root/common";

export const postCannotAlreadyExist: CommandIndexRule<CreatePost> = async (command: CreatePost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('Post', command.id);
    if(streamEvents.length > 0) {
        return ['Stream already exists'];
    }
    return [];
}   