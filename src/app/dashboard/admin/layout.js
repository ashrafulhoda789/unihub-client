import { requireRole } from '@/lib/core/session';
import React from 'react';

const AdminDashboardLayout = async ({ children }) => {
    await requireRole('admin')
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default AdminDashboardLayout;