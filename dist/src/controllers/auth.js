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
import { User } from '../../db/models/User.js';
const err500 = { sucess: false, msg: 'Please try again later' };
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                console.log(data);
                // Check if User exists
                var user = yield User.findOne({ email: data.email });
                console.log(user);
                if (user == null) { // There is no previous register
                    console.log('Registrar');
                    bcrypt.genSalt(parseInt(process.env.SALTROUNDS || "10"), function (err, salt) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err500);
                        }
                        console.log('genSalt c:');
                        bcrypt.hash(data.password, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                                return res.status(500).send(err500);
                            }
                            console.log('hash c:');
                            try {
                                console.log(data.email, ' ', hash);
                                user = new User({
                                    email: data.email,
                                    password: hash
                                });
                                yield user.save();
                                return res.status(200).send({ sucess: true, msg: 'User registered' });
                            }
                            catch (e) {
                                console.log(e.toString());
                                return res.status(500).send(err500);
                            }
                        }));
                    });
                }
                else
                    return res.status(200).send({ sucess: false, msg: 'User already registered.' });
            }
            else
                res.status(400).send({ errors: result.array().map(function (err) {
                        return err.msg;
                    }) });
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
}
function Test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).send('Holis');
    });
}
export { Register, Test };
