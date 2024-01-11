import { Schema, model } from 'mongoose';
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
// User model based on User schema
const User = model('User', userSchema);
export { User };
