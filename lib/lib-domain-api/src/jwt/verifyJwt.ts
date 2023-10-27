import jwt from 'jsonwebtoken';
import { ApiRestEnvironment } from '@root/api-rest';
import { JwtError } from './JwtError';

export const verifyJwt = (jwtTokenString: string): boolean => {
    try { 
        const verified = jwt.verify(jwtTokenString, ApiRestEnvironment.apiRest_Jwt_Secret_Key); 
        if(verified){ 
            return true; 
        }else{ 
            throw new JwtError('Access Denied', undefined); 
        } 
    } catch (error) { 
        throw new JwtError('Error', error);
    }
}