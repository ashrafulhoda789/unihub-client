'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const updatePassword = async ({ currentPassword, newPassword }) => {

    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers: await headers(),
    });
    return { success: true, message: 'Password changed successfully', data: result };

};