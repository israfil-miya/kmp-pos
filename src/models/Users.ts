import mongoose from 'mongoose';

interface User {
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
    validate: {
      validator: function (v: string) {
        return v.trim().length > 0;
      },
      message: 'Full name cannot be empty',
    },
  },
  email: {
    type: String,
    required: [true, 'Email is not given'],
    unique: true,
    validate: {
      validator: function (v: string) {
        return v.trim().length > 0;
      },
      message: 'Email cannot be empty',
    },
  },
  phone: { type: String, default: '' },
  note: { type: String, default: '' },
  password: {
    type: String,
    required: [true, 'Password is not given'],
    validate: {
      validator: function (v: string) {
        return v.trim().length > 6;
      },
      message: 'Password must be at least 6 characters',
    },
  },
  role: {
    type: String,
    required: [true, 'Role is not given'],
    validate: {
      validator: function (v: string) {
        return v.trim().length > 0;
      },
      message: 'Role cannot be empty',
    },
  },
  store: { type: String, default: null },
});

const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default User;
