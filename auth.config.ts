import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

export default {
  providers: [Google, Facebook],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow account linking by returning true
      // This will automatically link accounts with the same email
      return true;
    },
    async jwt({ token, user }) {
      // Include user ID in JWT token when user signs in
      if (user?.id) {
        token.id = user.id;
        // Handle guest data migration when user signs in
      }
      return token;
    },
    async session({ session, token }) {
      // Include user ID in session from JWT token
      if (token?.id && session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Allow account linking
  events: {
    async linkAccount({ user, account, profile }) {},
  },
} satisfies NextAuthConfig;
