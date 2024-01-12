import { Request, Response, RequestHandler, NextFunction  } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../../db/models/User.js'

const key: string = process.env.JWT_KEY || 'test_key';

// Declaration for token decoding
declare module 'jsonwebtoken' {
    export interface UserTokenJwtPayload extends jwt.JwtPayload {
        email: string;
        password: string;
        iat: number;
        exp: number;
    }
}

/**
 * Middleware for EP that require authentication.
 * Validates token expiration.
 * Validates user credentials.
 */
const validRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers['authorization'] == undefined){
        return res.status(403).send('Unauthorized request');
    } else {
        var token = req.headers['authorization'];
        if(req.headers['authorization'].indexOf('Bearer') == 0){
            token = token.substring(7);
        }
        
        try {
            var decoded = <jwt.UserTokenJwtPayload> jwt.verify(token, key);

            // Validate token expiration
            if(decoded.exp < (new Date().getTime() / 1000)){
                return res.status(403).send('Session expired. Please sign in again.');
            }

            // Review credentials
            if(!(await User.validCredentials(decoded.email, decoded.password))){
                return res.status(403).send('Unauthorized request');
            }

            next();
        } catch(err: any) {
            return res.status(400).send('Bad request: ' + err.toString());
        }
    }
}

/**
 * Request handler for non existing endpoints
 */
const notFound: RequestHandler = async (req: Request, res: Response) => {
    return res.status(404).send('Not found');
}

export { notFound, validRequest }