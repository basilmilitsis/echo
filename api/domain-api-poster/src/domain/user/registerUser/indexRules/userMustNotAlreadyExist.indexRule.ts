import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { RegisterUser } from "@root/domain/user/registerUser/RegisterUser.create.command";

export const userMustNotAlreadyExist: CommandIndexRule<RegisterUser> = async (command: RegisterUser, eventStream: EventStream): Promise<string[]> => {
    return [];
}   