import { CommandRule } from "@echo/lib-domain-api";
import { RegisterUser } from "@root/domain/user/registerUser/RegisterUser.create.command";

export const passwordMustBeStrong: CommandRule<RegisterUser> = (command: RegisterUser): string[] => {
    return [];
} 