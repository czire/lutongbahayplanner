import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export default {
  providers: [Google, Facebook],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if there's an existing user with the same email
      const existingUser = await prisma.user.findFirst({
        where: {
          email: user.email!,
        },
        include: { accounts: true },
      });

      if (existingUser) {
        // Check if this provider is already linked
        const accountExists = existingUser.accounts.some(
          (acc) =>
            acc.provider === account?.provider &&
            acc.providerAccountId === account.providerAccountId
        );

        if (!accountExists) {
          // Link new provider to the existing user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account?.provider ? account.provider : "",
              providerAccountId: account?.providerAccountId
                ? account.providerAccountId
                : "",
              type: account?.type ? account.type : "",
              access_token: account?.access_token ? account.access_token : "",
              refresh_token: account?.refresh_token
                ? account.refresh_token
                : "",
              id_token: account?.id_token,
              scope: account?.scope,
              expires_at: account?.expires_at,
              token_type: account?.token_type,
            },
          });
        }
      }

      // No existing user? Let NextAuth create one
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
  pages: {
    signIn: "/",
    error: "/auth/error",
  },

  // Allow account linking
  events: {
    async linkAccount({ user, account, profile }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(), // Set email verified date on account link
        },
      });
    },
  },
} satisfies NextAuthConfig;
