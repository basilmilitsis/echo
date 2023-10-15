import { Serializable } from '@echo/lib-common';
import { Id } from './Id';

export type Credentials = {
    id: string;
    name: string;
    roles: string[];
};

export interface OperationContext extends Record<string, Serializable> {
    operationId: Id;
    correlationId: string | null;
    credentials: Credentials | null;
    customMetadata: Record<string, string>;
}
