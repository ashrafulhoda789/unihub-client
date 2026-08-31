import { headers } from "next/headers";
import { auth } from "../auth";
import { serverFetch } from "../core/server";

export const getUserList = async () => {
    const users = await auth.api.listUsers({
        query: {

            sortBy: "createdAt",
            sortDirection: "desc",

        },

        headers: await headers(),
    });

    return users
}

export const allUsers = async() =>{
    return serverFetch('/api/users')
}