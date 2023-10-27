import { OperationContext } from '@root/domain';
import { JwtToken } from '@root/jwt';

export const buildCommandContext = (
    generateUuid: () => string,
    jwt: JwtToken | undefined,
    requestMetadata: {} /* TODO */
): OperationContext => ({
    operationId: generateUuid(),
    correlationId: null,
    credentials: jwt
        ? {
              id: jwt.sub,
              firstName: jwt.firstName,
              lastName: jwt.lastName,
              email: jwt.email,
              profilePicture: jwt.profilePicture,
              roles: ['admin'], // TODO: Get roles from JWT
          }
        : null,
    customMetadata: {
        ...requestMetadata,
    },
});
