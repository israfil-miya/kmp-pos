import mongoose from 'mongoose';

// Interface for User document
interface User {
  full_name: string;
  email: string;
  password: string;
  role: string;
  warehouse: string | null;
}

// Create User schema with type annotations for properties
const UserSchema = new mongoose.Schema<User>({
  full_name: {
    type: String,
    required: [true, 'Full name is not given'],
  },
  email: {
    type: String,
    required: [true, 'Email is not given'],
    unique: true,
    index: true,
  },
  password: { type: String, required: [true, 'Password is not given'] },
  role: { type: String, required: [true, 'Role is not given'] },
  warehouse: { type: String, default: null },
});

// Define User model based on schema, using generics for type safety
const User = mongoose.models.User || mongoose.model<User>('User', UserSchema);

// Export the User model
export default User;
