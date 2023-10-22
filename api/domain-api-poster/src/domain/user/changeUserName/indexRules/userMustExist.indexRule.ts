import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { ChangeUserName } from "@root/domain/user/changeUserName/ChangeUserName.update.command";

export const userMustExist: CommandIndexRule<ChangeUserName> = async (command: ChangeUserName, eventStream: EventStream): Promise<string[]> => {
    return [];
}   