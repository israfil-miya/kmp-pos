import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the default User type
declare module 'next-auth' {
  interface Session {
    user: {
      db_id: string;
      full_name: string;
      user_name: string;
      email: string;
      role: string;
      warehouse: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    db_id: string;
    full_name: string;
    user_name: string;
    email: string;
    role: string;
    warehouse: string | null;
  }
}

// Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    db_id: string;
    full_name: string;
    user_name: string;
    email: string;
    role: string;
    warehouse: string | null;
  }
}
