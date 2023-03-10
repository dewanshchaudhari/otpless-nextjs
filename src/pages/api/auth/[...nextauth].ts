import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                waId: { label: "waId", type: "text" },
            },
            async authorize(credentials, req) {
                const waId = credentials?.waId;
                const res = await fetch(`http://localhost:3000/api/login`, {
                    method: 'POST',
                    body: JSON.stringify({ waId }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) return null;
                const { user, success } = await res.json();
                if (success) return user;
                else return null
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token as any;
            return session;
        }
    }
}

export default NextAuth(authOptions)