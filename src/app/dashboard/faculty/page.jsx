'use client';

import { useState, useEffect } from 'react';
import {
    Layers,
    BookOpen,
    FileText,
    Users,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getPitchForSpecificUser } from '@/lib/api/myPitch';
import { getResources } from '@/lib/api/curriculum';
import { getClassroomResources } from '@/lib/api/classroom';
import { getUserJoinRequests } from '@/lib/api/joinRequest';
import { useSession } from '@/lib/auth-client';

export default function FacultyDashboardPage() {
    const [stats, setStats] = useState({
        pitches: 0,
        curriculums: 0,
        classroomResources: 0
    });
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();

    const userId = session?.user?._id || session?.user?.id;
    const userEmail = session?.user?.email;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Assigned Pitches
                const pitchRes = await getPitchForSpecificUser(userId);
                const pitchesList = pitchRes?.data || pitchRes || [];

                // 2. Fetch Curriculum Resources (Total created curriculum)
                const curriculumRes = await getResources(userEmail);
                const curriculumsList = curriculumRes?.data || curriculumRes?.resources || [];

                // 3. Fetch Classroom Resources
                const classroomRes = await getClassroomResources(userEmail);
                const classroomList = classroomRes?.data || classroomRes?.resources || [];

                // 4. Fetch Recent Join Requests
                const joinReqRes = await getUserJoinRequests(userId, { limit: 5 });
                const requestsList = joinReqRes?.data || joinReqRes?.requests || [];

                setStats({
                    pitches: Array.isArray(pitchesList) ? pitchesList.length : 0,
                    curriculums: Array.isArray(curriculumsList) ? curriculumsList.length : 0,
                    classroomResources: Array.isArray(classroomList) ? classroomList.length : 0
                });

                setJoinRequests(Array.isArray(requestsList) ? requestsList : []);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId && userEmail) {
            fetchDashboardData();
        }
    }, [userId, userEmail]);

    return (
        <div className="max-w-7xl mx-auto text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Faculty Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Welcome back! Here is a summary of your assigned activities and student requests.
                </p>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

                {/* Total Assigned Pitches */}
                <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assigned Pitches</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                            {loading ? '...' : stats.pitches}
                        </h3>
                    </div>
                    <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                        <Layers size={24} />
                    </div>
                </div>

                {/* Total Created Curriculum */}
                <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Curriculum</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                            {loading ? '...' : stats.curriculums}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                </div>

                {/* Total Classroom Resources */}
                <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classroom Resources</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-sky-400">
                            {loading ? '...' : stats.classroomResources}
                        </h3>
                    </div>
                    <div className="p-3 bg-sky-600/10 border border-sky-500/20 text-sky-400 rounded-xl">
                        <FileText size={24} />
                    </div>
                </div>

            </div>

            {/* Recent Join Requests Section */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="text-indigo-400" size={20} />
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                            Recent Join Request Status
                        </h3>
                    </div>
                    <Link
                        href="/dashboard/faculty/faculty-pitch-request"
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="py-10 text-center text-xs text-slate-500 animate-pulse">
                        Loading join requests...
                    </div>
                ) : joinRequests.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/60">
                        No recent join requests found.
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View (Hidden on Mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-3 px-4">Pitch</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {joinRequests.map((req, idx) => {
                                        const status = (req.status || 'PENDING').toUpperCase();
                                        return (
                                            <tr key={req._id || idx} className="hover:bg-slate-900/40 transition">
                                                <td className="py-3.5 px-4 font-semibold text-slate-200">
                                                    {req.pitchTitle || req.title || req.pitchId?.title || 'Untitled Pitch'}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-400 uppercase text-xs">
                                                    {req.category || 'General'}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${status === 'APPROVED'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : status === 'REJECTED'
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                        {status === 'APPROVED' && <CheckCircle2 size={12} />}
                                                        {status === 'REJECTED' && <XCircle size={12} />}
                                                        {status === 'PENDING' && <Clock size={12} />}
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <Link
                                                        href={`/pitches/${req.pitchId}`}
                                                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold transition border border-slate-700"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout View (Visible only on Mobile) */}
                        <div className="grid grid-cols-1 gap-3 md:hidden">
                            {joinRequests.map((req, idx) => {
                                const status = (req.status || 'PENDING').toUpperCase();
                                return (
                                    <div
                                        key={req._id || idx}
                                        className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                                                    {req.category || 'General'}
                                                </span>
                                                <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                                                    {req.pitchTitle || req.title || req.pitchId?.title || 'Untitled Pitch'}
                                                </h4>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${status === 'APPROVED'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : status === 'REJECTED'
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {status === 'APPROVED' && <CheckCircle2 size={10} />}
                                                {status === 'REJECTED' && <XCircle size={10} />}
                                                {status === 'PENDING' && <Clock size={10} />}
                                                {status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                                            <span className="text-[11px] text-slate-400">Request Status</span>
                                            <Link
                                                href={`/pitches/${req.pitchId}`}
                                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold transition border border-slate-700 flex items-center gap-1"
                                            >
                                                View Details <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}