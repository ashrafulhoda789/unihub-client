'use server'

import { headers } from "next/headers";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const updateUserRole = async (userId, role) => {
    const data = await auth.api.setRole({
        body: {
            userId: userId,
            role: role
        },

        headers: await headers(),
    });

    revalidatePath('/dashboard/admin/user-management')

    return data;
}

export const updateUserProfile = async (formData) => {
    return serverMutation('/api/users', formData, 'PATCH');
};