import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id:string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture?: string;
  status: boolean;
  role:string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      },
    profilePicture: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
       type:String,
       required:true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
