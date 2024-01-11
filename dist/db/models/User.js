var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// User schema based on User interface
const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (emailValue) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(emailValue);
            }
        },
        required: [true, 'Email address required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
});
userSchema.static('emailAlreadyRegistered', function emailAlreadyRegistered(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email: email });
        return !(user == null);
    });
});
userSchema.static('validCredentials', function validCredentials(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email: email });
        if (user == null) { // Email not registered
            return false;
        }
        try {
            // Compare encrypted password
            return yield bcrypt.compare(password, user.password);
        }
        catch (e) {
            throw e;
        }
    });
});
// User model based on User schema
const User = model('User', userSchema);
export { User };
