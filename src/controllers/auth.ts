import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcrypt';

import { IUser, User } from '../../db/models/User.js'

const err500 = { success : false, msg : 'Please try again later' };

/**
 * User registration for the first time. 
 */
async function SignUp (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (result.isEmpty()) { // Valid data for request
            const data = matchedData(req);

            // Check if User exists
            var user: IUser | null = await User.findOne({ email: data.email })
            if(user == null){ // There is no previous registration
                
                // Password encryption to create MongoDB document
                bcrypt.genSalt(parseInt(process.env.SALTROUNDS || "10"), function(err, salt) {
                    if(err) {
                        console.log(err);
                        return res.status(500).send(err500);
                    }
                    bcrypt.hash(data.password, salt, async (err, hash) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).send(err500);
                        } 
                        try{
                            // User document creation
                            user = new User({
                                email: data.email,
                                password: hash
                            });
                            
                            await user.save();

                            return res.status(200).send({ success : true, msg : 'User registered' });
                        }catch(e: any){
                            return res.status(500).send(err500);
                        }
                    });
                });
                
            } else return res.status(200).send({ success : false, msg : 'User already registered.' });
        } else res.status(400).send({ success: false, errors: result.array().map(function(err){
            return err.msg // Returns errors of data validation
        })});
    } catch (error: any) {
        res.status(500).send(error.message);
    }
}

export { SignUp }