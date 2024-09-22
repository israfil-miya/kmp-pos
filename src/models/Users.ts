import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  full_name: string;
  email: string;
  phone: string;
  note: string;
  password: string;
  role: string;
  store: string | null;
}

const UserSchema = new mongoose.Schema<User>({
  full_name: {
    type: String,
    required: [true, 'Full name is not given'],
    minlength: [1, 'Full name must be at least 1 character'],
  },
  email: {
    type: String,
    required: [true, 'Email is not given'],
    unique: true,
    minlength: [1, 'Email must be at least 1 character'],
  },
  phone: { type: String, default: '' },
  note: { type: String, default: '' },
  password: {
    type: String,
    required: [true, 'Password is not given'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    required: [true, 'Role is not given'],
    minlength: [1, 'Role must be at least 1 character'],
  },
  store: { type: String, default: null },
});

const User =
  (mongoose.models?.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default User;
