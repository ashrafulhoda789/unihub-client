import { requireRole } from '@/lib/core/session';
import React from 'react';

const StudentDashboardLayout = async ({ children }) => {
    await requireRole('student')
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default StudentDashboardLayout;