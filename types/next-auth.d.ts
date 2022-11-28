import NextAuth from "next-auth"
import JWT from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        user: User
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
        error?: string
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        id: string
        name: string
        email: string
    }
    interface Session {
        user: User
        error: string
        accessToken: string
    }
}