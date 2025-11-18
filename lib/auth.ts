// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials;

        // DÙNG SERVICE ROLE → BYPASS RLS
        const { data, error } = await supabaseAdmin
          .from("Users")
          .select("UserID, Email, PasswordHash, FullName, Role")
          .eq("Email", email)
          .single();

        if (error || !data) {
          console.error("Login error (select user):", error);
          return null;
        }

        const isValid = await bcrypt.compare(password, data.PasswordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: data.UserID,
          email: data.Email,
          name: data.FullName,
          role: data.Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | any }) {
      if (user) {
        (token as any).role = user.role;
        (token as any).userId = user.id ?? (user as any)?.UserID ?? null;
      }
      if (!(token as any).userId && token.sub) {
        (token as any).userId = token.sub;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).userId ?? token.sub ?? null;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
