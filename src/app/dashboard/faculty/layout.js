import { requireRole } from '@/lib/core/session';
import React from 'react';

const FacultyDashboardLayout = async({children}) => {
    await requireRole('faculty')
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default FacultyDashboardLayout;