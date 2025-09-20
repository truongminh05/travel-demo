import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabaseClient";
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
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { data: user, error } = await supabase
            .from("Users")
            .select("UserID,Username, Email, PasswordHash, FullName, Role")
            .eq("Email", credentials.email)
            .single();
          if (error || !user) return null;
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.PasswordHash
          );
          if (!isPasswordValid) return null;
          return {
            id: user.UserID,
            email: user.Email,
            name: `${user.FullName} ${user.Username}`,
            role: user.Role,
          };
        } catch (error) {
          console.error("Lỗi xác thực Supabase:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | any }) {
      if (user) (token as any).role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) (session.user as any).role = (token as any).role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
