import { Command } from '@echo/lib-domain-api';

export interface CreateUserProfile extends Command {
    firstName: string;
    lastname: string;
}
