var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { User } from '../../db/models/User.js';
const key = process.env.JWT_KEY || 'test_key';
/**
 * Middleware for EP that require authentication.
 * Validates token expiration.
 * Validates user credentials.
 */
const validRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['authorization'] == undefined) {
        return res.status(403).send('Unauthorized request');
    }
    else {
        var token = req.headers['authorization'];
        if (req.headers['authorization'].indexOf('Bearer') == 0) {
            token = token.substring(7);
        }
        try {
            var decoded = jwt.verify(token, key);
            // Validate token expiration
            if (decoded.exp < (new Date().getTime() / 1000)) {
                return res.status(403).send('Session expired. Please sign in again.');
            }
            // Review credentials
            if (!(yield User.validCredentials(decoded.email, decoded.password))) {
                return res.status(403).send('Unauthorized request');
            }
            next();
        }
        catch (err) {
            return res.status(400).send('Bad request: ' + err.toString());
        }
    }
});
/**
 * Request handler for non existing endpoints
 */
const notFound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(404).send('Not found');
});
export { notFound, validRequest };
