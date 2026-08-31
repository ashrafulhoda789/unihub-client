import React from 'react';
import { getAllPitches } from '@/lib/api/myPitch';
import { getPublicCurriculum } from '@/lib/api/curriculum';
import { getPublicClassroomResources } from '@/lib/api/classroom';
import { getUserList } from '@/lib/api/users';
import { Users, FileText, BookOpen, Layers } from 'lucide-react';
import AdminGrowthAnalytics from '@/components/dashboard/AdminGrowthAnalytics';

const AdminDashboardPage = async () => {
    let totalUsers = 0;
    let totalPitches = 0;
    let totalCurriculum = 0;
    let totalClassroom = 0;
    let latestPitches = [];
    let latestResources = [];
    let rawUsersList = [];
    let combinedResources = [];

    try {
        const usersData = await getUserList();
        rawUsersList = usersData?.users || usersData?.data || (Array.isArray(usersData) ? usersData : []);
        totalUsers = usersData?.total || rawUsersList.length || 0;

        const pitchesData = await getAllPitches({ page: 1, limit: 4 });
        totalPitches = pitchesData?.total || pitchesData?.pitches?.length || 0;
        latestPitches = pitchesData?.pitches || pitchesData?.data || [];

        const curriculumData = await getPublicCurriculum('All', 'All', '', 1, 100);
        totalCurriculum = curriculumData?.total || curriculumData?.data?.length || 0;
        const curriculumList = (curriculumData?.data || curriculumData || []).map(item => ({
            ...item,
            resourceType: 'Curriculum'
        }));

        const classroomData = await getPublicClassroomResources('All', 'All', 'All', '', 1, 100);
        totalClassroom = classroomData?.total || classroomData?.data?.length || 0;
        const classroomList = (classroomData?.data || classroomData || []).map(item => ({
            ...item,
            resourceType: 'Classroom'
        }));

        combinedResources = [...curriculumList, ...classroomList];

        // শর্ট করে লেটেস্ট ৪টি রিসোর্স আলাদা করা
        const sortedResources = [...combinedResources];
        sortedResources.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        latestResources = sortedResources.slice(0, 4);

    } catch (error) {
        console.error("Dashboard data fetch error:", error);
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen text-slate-100">

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-slate-400">Welcome back! Here is a summary of overall system activities.</p>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard title="TOTAL USERS" count={totalUsers} icon={<Users className="text-cyan-400 w-5 h-5" />} />
                <StatCard title="TOTAL PITCHES" count={totalPitches} icon={<FileText className="text-cyan-400 w-5 h-5" />} />
                <StatCard title="CURRICULUM RESOURCES" count={totalCurriculum} icon={<BookOpen className="text-cyan-400 w-5 h-5" />} />
                <StatCard title="CLASSROOM RESOURCES" count={totalClassroom} icon={<Layers className="text-cyan-400 w-5 h-5" />} />
            </div>

            {/* Analytics Section (Growth Chart) - Dynamic Data Passed */}
            <AdminGrowthAnalytics users={rawUsersList} resources={combinedResources} />

            {/* Tables Section (Latest Pitches & Resources) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Latest Pitches */}
                <div className="bg-[#0e1626] p-4 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <FileText className="text-slate-400 w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            <h2 className="text-sm sm:text-base font-semibold text-slate-200">Latest Pitches</h2>
                        </div>
                    </div>

                    <div className="block md:hidden space-y-3.5">
                        {latestPitches.length > 0 ? (
                            latestPitches.map((pitch) => (
                                <div key={pitch._id || pitch.id} className="p-4 bg-[#0b101c] border border-slate-800/60 rounded-xl space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">
                                            {pitch.category || 'N/A'}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30">
                                            {pitch.status || 'ACTIVE'}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-200 text-sm leading-snug">
                                        {pitch.title}
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-500 text-xs">No pitches found</div>
                        )}
                    </div>

                    <div className="hidden md:block w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                    <th className="py-3 px-3">Pitch</th>
                                    <th className="py-3 px-3">Category</th>
                                    <th className="py-3 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-sm">
                                {latestPitches.length > 0 ? (
                                    latestPitches.map((pitch) => (
                                        <tr key={pitch._id || pitch.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="py-4 px-3 font-medium text-slate-200 truncate max-w-[180px]">
                                                {pitch.title}
                                            </td>
                                            <td className="py-4 px-3 text-xs text-slate-400 uppercase font-medium">{pitch.category || 'N/A'}</td>
                                            <td className="py-4 px-3 whitespace-nowrap">
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30">
                                                    {pitch.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-6 text-slate-500">No pitches found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Latest Resources */}
                <div className="bg-[#0e1626] p-4 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <Layers className="text-slate-400 w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            <h2 className="text-sm sm:text-base font-semibold text-slate-200">Latest Resources</h2>
                        </div>
                    </div>
                    <div className="space-y-3 sm:space-y-3.5">
                        {latestResources.length > 0 ? (
                            latestResources.map((res, index) => (
                                <div key={res._id || res.id || index} className="flex items-center justify-between gap-3 p-3.5 bg-[#0b101c] border border-slate-800/60 rounded-xl hover:border-slate-700 transition">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-slate-200 text-xs sm:text-sm truncate">
                                            {res.title || res.name}
                                        </h4>
                                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                                            {res.department || 'CSE'} - Sem {res.semester || '1'}
                                        </p>
                                    </div>
                                    <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${res.resourceType === 'Classroom' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                        }`}>
                                        {res.resourceType}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-500 text-xs sm:text-sm">No resources found</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ title, count, icon }) => (
    <div className="bg-[#0e1626] p-4 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex items-center justify-between">
        <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 sm:mt-1.5">{count}</h3>
        </div>
        <div className="p-2.5 sm:p-3 bg-[#0b101c] border border-slate-800 rounded-xl shrink-0 ml-3">
            {icon}
        </div>
    </div>
);

export default AdminDashboardPage;