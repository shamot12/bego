import { Schema, model, Model, Document, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
interface IUser extends Document {
    email: string;
    password: string;
}

interface IUserMethods { }
  
interface UserModel extends Model<Required<IUser>, {}, IUserMethods> {
    emailAlreadyRegistered(email: string): Promise<boolean>;
    validCredentials(email: string, password: string):  Promise<boolean>;
}
// User schema based on User interface
const userSchema = new Schema<Required<IUser>, UserModel, IUserMethods>({
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

userSchema.static('emailAlreadyRegistered', async function emailAlreadyRegistered(email: string): Promise<boolean> {
    const user = await User.findOne({ email : email })
    return !(user == null);
});

userSchema.static('validCredentials', async function validCredentials(email: string, password: string): Promise<boolean> {
    const user: IUser | null = await User.findOne({ email: email })

    if(user == null){ // Email not registered
        return false;
    }
    try{
        // Compare encrypted password
        return await bcrypt.compare(password, user.password);
    } catch (e) {
        throw e;
    }
});

// User model based on User schema
const User = model<Required<IUser>, UserModel> ('User' , userSchema);


export { User }