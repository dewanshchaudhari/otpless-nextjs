import NextAuth from "next-auth";
declare module "next-auth" {
    interface Session {
        user: {
            waId: string,
            waNumber: string,
            waName: string,
            timestamp: string,
            accessToken: string
        }
    }
}
