var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../db/models/User.js';
const err500 = { success: false, message: 'Please try again later.' };
/**
 * User registration for the first time.
 * Password is encrypted when registration is performed.
 * @returns Object with success boolean aknowledge and message string
 */
function SignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) { // Valid data for request
                const data = matchedData(req);
                // Check if User exists
                var user = yield User.findOne({ email: data.email });
                if (user == null) { // There is no previous registration
                    // Password encryption to create MongoDB document
                    bcrypt.genSalt(parseInt(process.env.ENCRYPT_SALTROUNDS || "10"), function (err, salt) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err500);
                        }
                        bcrypt.hash(data.password, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                                return res.status(500).send(err500);
                            }
                            try {
                                // User document creation
                                user = new User({
                                    email: data.email,
                                    password: hash
                                });
                                yield user.save();
                                return res.status(200).send({ success: true, message: 'User registered.' });
                            }
                            catch (e) {
                                return res.status(500).send(err500);
                            }
                        }));
                    });
                }
                else
                    return res.status(200).send({ success: false, message: 'User already registered.' });
            }
            else
                res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
        }
        catch (error) {
            res.status(500).send({ success: false, errors: error.message });
        }
    });
}
/**
 * User login. Validates existing user credentials.
 * On valid credentials: @returns Object with success boolean aknowledge and JWT token
 * On invalid credentials: @returns Object with success boolean aknowledge and message string
 */
function SignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = validationResult(req);
        if (result.isEmpty()) { // Valid data for request
            const data = matchedData(req);
            // Check if User exists
            var user = yield User.findOne({ email: data.email });
            if (user == null) { // Email not registered
                return res.status(200).send({ success: false, message: 'Invalid credentials.' });
            }
            try {
                // Compare encrypted password
                bcrypt.compare(data.password, user.password, function (err, result) {
                    if (err) {
                        return res.status(500).send(err500);
                    }
                    if (result) { // Correct password
                        var key = process.env.JWT_KEY || 'test_key';
                        var token = jwt.sign(data, key, { expiresIn: '2h' }); // Token exipres in 1h
                        return res.status(200).send({ success: true, token: token });
                    }
                    else { // Invalid password
                        return res.status(200).send({ success: false, message: 'Invalid credentials.' });
                    }
                });
            }
            catch (e) {
                return res.status(500).send(err500);
            }
        }
        else
            res.status(400).send({ success: false, errors: result.array().map(function (err) {
                    return err.msg; // Returns errors of data validation
                }) });
    });
}
export { SignUp, SignIn };
