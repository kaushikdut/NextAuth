import { db } from "@/lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, req) {
        if (credentials) {
          const { email, password } = credentials;

          if (!email || !password) {
            return null;
          }

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (user) {
            return { ...user, id: user.id.toString() };
          }

          return null;
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
