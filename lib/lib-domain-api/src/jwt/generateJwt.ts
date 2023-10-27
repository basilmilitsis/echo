import { JwtCustomContent } from './JwtToken';
import { ApiRestEnvironment } from '@root/api-rest';
import jwt from 'jsonwebtoken';

export const generateJwt = (customContent: JwtCustomContent): string =>
    jwt.sign(customContent, ApiRestEnvironment.apiRest_Jwt_Secret_Key);
