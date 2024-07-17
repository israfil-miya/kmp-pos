import mongoose from 'mongoose';

interface User {
  full_name: string;
  email: string;
  phone?: string;
  note?: string;
  password: string;
  role: string;
  store: string | null;
}

const UserSchema = new mongoose.Schema<User>({
  full_name: {
    type: String,
    required: [true, 'Full name is not given'],
  },
  email: {
    type: String,
    required: [true, 'Email is not given'],
    unique: true,
  },
  phone: { type: String, default: '' },
  note: { type: String, default: '' },
  password: { type: String, required: [true, 'Password is not given'] },
  role: { type: String, required: [true, 'Role is not given'] },
  store: { type: String, default: null },
});

const User = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default User;
