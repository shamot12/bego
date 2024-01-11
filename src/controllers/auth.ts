import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../../db/models/User.js'

const err500 = { success : false, message : 'Please try again later.' };

/**
 * User registration for the first time. 
 * Password is encrypted when registration is performed.
 * @returns Object with success boolean aknowledge and message string
 */
async function SignUp (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (result.isEmpty()) { // Valid data for request
            const data = matchedData(req);

            // Check if User exists
            var existingUser = await User.emailAlreadyRegistered(data.email);

            if(existingUser){ 
                return res.status(200).send({ success : false, message : 'User already registered.' });
            }
            // else there is no previous registration
                
            // Password encryption to create MongoDB document
            bcrypt.hash(data.password, parseInt(process.env.ENCRYPT_SALTROUNDS || "10")).then(async (hash) => {
                try{
                    // User document creation
                    var user = new User({
                        email: data.email,
                        password: hash
                    });
                    
                    await user.save();

                    return res.status(200).send({ success : true, message : 'User registered.' });
                }catch(e: any){
                    return res.status(500).send(err500);
                }
            }).catch((err) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send(err500);
                } 
            });
        } else res.status(400).send({ success: false, errors: result.array().map(function(err){
            return err.msg // Returns errors of data validation
        })});
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}

/**
 * User login. Validates existing user credentials.
 * On valid credentials: @returns Object with success boolean aknowledge and JWT token
 * On invalid credentials: @returns Object with success boolean aknowledge and message string
 */
async function SignIn  (req: Request, res: Response) {
    const result = validationResult(req);
    if (result.isEmpty()) { // Valid data for request
        const data = matchedData(req);
        // Check if User exists
        var validUser = await User.validCredentials(data.email, data.password);

        if(!validUser){ // Invalid credentials
            return res.status(200).send({ success : false, message : 'Invalid credentials.' });
        }
        // Login successful
        try{
            // Generate and return token
            const key: string = process.env.JWT_KEY || 'test_key';
            var token = jwt.sign(data, key, { expiresIn: '1h' }); // Token exipres in 1h
            return res.status(200).send({ success : true, token : token });
        } catch (e) {
            return res.status(500).send(err500);
        }

    } else res.status(400).send({ success: false, errors: result.array().map(function(err){
        return err.msg // Returns errors of data validation
    })});
}
export { SignUp, SignIn }