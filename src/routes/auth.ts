import express from 'express';
import { checkSchema } from 'express-validator';

import { SignUp, SignIn } from '../controllers/auth.js'

export const authRouter = express.Router();

const authValidatorSchema = checkSchema({
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
});

/**
 * User registration route
 * POST request : application/json
 * @param email - required - valid email
 * @param password - required - length must be at least 8 characters
 */
authRouter.post('/signup', authValidatorSchema, SignUp);


/**
 * User login route
 * POST request : application/json
 * @param email - required - valid email
 * @param password - required - length must be at least 8 characters
 */
authRouter.post('/signin', authValidatorSchema, SignIn);
