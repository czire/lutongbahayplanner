import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const ALLOW_AUTO_OAUTH_LINKING = true;

export default {
  providers: [
    Google,
    Facebook,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const rawPassword = credentials?.password;
        if (typeof rawEmail !== "string" || typeof rawPassword !== "string")
          return null;
        const email = rawEmail.toLowerCase().trim();
        const password = rawPassword;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (!user.hashedPassword) {
          throw new Error(
            "Account registered via social login. Sign in with Google/Facebook or set a password."
          );
        }
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.provider) return true;
      if (account.provider === "credentials") return true;
      const email = user.email?.toLowerCase().trim();
      if (!email) return false;
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true },
      });
      if (existingUser) {
        const accountExists = existingUser.accounts.some(
          (acc) =>
            acc.provider === account.provider &&
            acc.providerAccountId === account.providerAccountId
        );
        if (!accountExists) {
          if (!ALLOW_AUTO_OAUTH_LINKING) return false;
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId ?? "",
              type: account.type ?? "",
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              id_token: account.id_token,
              scope: account.scope,
              expires_at: account.expires_at,
              token_type: account.token_type,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session?.user) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/auth/login", error: "/auth/error" },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
} satisfies NextAuthConfig;
