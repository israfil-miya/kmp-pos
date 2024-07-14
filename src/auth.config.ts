import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/login',
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // When a user logs in, attach user data to the token
      if (user) {
        token.db_id = user.db_id;
        token.full_name = user.full_name;
        token.email = user.email;
        token.role = user.role;
        token.warehouse = user.warehouse;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Attach token data to the session
      if (token) {
        session.user.db_id = token.db_id;
        session.user.full_name = token.full_name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.warehouse = token.warehouse;
      }
      return session;
    },
    authorized({ auth }: { auth: any }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
