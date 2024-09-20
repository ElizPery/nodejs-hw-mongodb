import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateOptions } from "./hooks.js";
import { emailRegexp } from '../../constants/users.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: emailRegexp, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateOptions);


export const UsersCollection = model('users', userSchema);