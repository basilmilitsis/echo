import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { CreateUserProfile } from "@root/domain/userProfile/createUserProfile/CreateUserProfile.create.command";

export const userMustNotAlreadyExist: CommandIndexRule<CreateUserProfile> = async (command: CreateUserProfile, eventStream: EventStream): Promise<string[]> => {
    // TODO
    return [];
}   