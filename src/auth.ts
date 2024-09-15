import User from '@/models/Users';
import dbConnect from '@/utility/dbConnect';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
dbConnect();

interface UserTypes {
  db_id: string;
  full_name: string;
  email: string;
  role: string;
  store: string | null;
}

async function getUser(
  email: string,
  password: string,
): Promise<UserTypes | null> {
  try {
    const userData = await User.findOne({
      email: email,
      password: password,
    });

    if (!userData) {
      return null;
    }

    const user: UserTypes = {
      db_id: userData._id as string,
      full_name: userData.full_name as string,
      email: userData.email as string,
      role: userData.role as string,
      store: (userData.store as string) || null,
    };

    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await getUser(
          credentials?.email as string,
          credentials?.password as string,
        );

        return user ?? null;
      },
    }),
  ],
});
