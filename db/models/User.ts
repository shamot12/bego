import { Schema, model, Model, Document } from 'mongoose';

// User interface
interface IUser extends Document {
    email: string;
    password: string;
}

// User schema based on User interface
const userSchema = new Schema<Required<IUser>>({
    email: {
        type: String,
        validate: {
            validator: function (emailValue: string): boolean {
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
const User: Model<Required<IUser>> = model('User', userSchema);

export { IUser, User }