import { OperationContext } from "@root/domain";

// TODO: extract correlationId/credentials/metadata from request
export const extractContext = (generateUuid: () => string): OperationContext => {
    return {
        operationId: generateUuid(),
        correlationId: null,
        credentials: {
            id: '123',
            name: 'Bob Builder',
            roles: ['admin'],
        },
        customMetadata: {},
    };
}