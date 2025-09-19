import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDbPool, sql } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions = {
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

        try {
          const pool = await getDbPool(); // Lấy pool kết nối
          const result = await pool
            .request()
            .input("Email", sql.NVarChar, credentials.email)
            .query("SELECT * FROM Users WHERE Email = @Email");

          const user = result.recordset[0];

          if (user && user.PasswordHash) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.PasswordHash
            );

            if (isPasswordValid) {
              return {
                id: user.UserID.toString(),
                email: user.Email,
                name: `${user.FirstName} ${user.LastName}`,
                role: user.Role,
              };
            }
          }
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // Ghi thêm thông tin role vào session và token
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Chuyển hướng người dùng đến trang này nếu chưa đăng nhập
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET, // Thêm secret vào file .env.local
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
