import express from 'express';
import { checkSchema } from 'express-validator';

import { SignUp } from '../controllers/auth.js'

export const authRouter = express.Router();

/**
 * User registration route
 * POST request : application/json
 * @param email - required - valid email
 * @param password - required - length must be at least 8 characters
 */
authRouter.post('/signup', checkSchema({
        email: {
            isEmail: true,
            errorMessage: 'Invalid email',
        },
        password: {
            isLength: {
                options: { min: 8 },
                errorMessage: 'Password length must be at least 8 characters',
            },
        },
    }), SignUp)
