import { Command } from '@echo/lib-domain-api';

export interface SetUserProfileLocation extends Command {
    lat: string;
    long: string;
}
