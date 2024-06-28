import mongoose, { Document, Model, Schema } from 'mongoose';
export interface User extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    createdAt: {type:Date, default: new Date()}
});

const UserModel: Model<User> = mongoose.model<User>('User', UserSchema);

export default UserModel;
