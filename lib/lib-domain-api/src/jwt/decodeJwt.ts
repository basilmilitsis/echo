import jwt from 'jsonwebtoken';
import { JwtError } from './JwtError';
import { JwtToken } from './JwtToken';

export const decodeJwt = (jwtTokenString: string): JwtToken => {
    try { 
        const token = jwt.decode(jwtTokenString);
        if(!token) {
            throw new JwtError('Could not decode token', undefined);
        }
        if(typeof token === 'string') {
            throw new JwtError('Could not decode token', undefined);
        }
        return token as JwtToken;  // TODO: Check if this is in a valid JwtToken shape
    } catch (error) { 
        throw new JwtError('Error decoding token', error);
    }
}