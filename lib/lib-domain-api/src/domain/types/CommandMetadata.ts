import { Serializable } from '@echo/lib-common';
import { Id } from './Id';

export type Credentials = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | undefined;
    roles: string[];
};

export interface CommandMetadata extends Record<string, Serializable> {
    operationId: Id;
    correlationId: string | null;
    credentials: Credentials | null;
    customMetadata: Record<string, string>;
}
