import express from 'express';
import { checkSchema } from 'express-validator';
import { Register, Test } from '../controllers/auth.js';
export const authRouter = express.Router();
authRouter.get('/test', Test);
authRouter.post('/signup', checkSchema({
    email: {
        isEmail: true,
        errorMessage: 'Invalid email',
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 chars',
        },
    },
}), Register);
