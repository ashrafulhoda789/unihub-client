import { headers } from "next/headers";
import { auth } from "../auth";

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