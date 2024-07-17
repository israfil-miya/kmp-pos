import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface User {
  id: string;
  db_id: string;
  full_name: string;
  email: string;
  role: string;
  store: string | null;
}

async function getUser(email: string, password: string): Promise<User | null> {
  try {
    const res = await fetch(BASE_URL + '/api/user?action=handle-login', {
      method: 'GET',
      headers: { email: email, password: password },
    });

    if (res.status !== 200) {
      return null;
    }

    const userData = await res.json();

    const user: User = {
      id: userData._id,
      db_id: userData._id,
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role,
      store: userData.store || null,
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
