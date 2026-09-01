import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
   
    baseURL: "https://unihub-client-blue.vercel.app",
    plugins: [
        adminClient()
    ]
})

export const { signIn, signUp, signOut, useSession } = createAuthClient()