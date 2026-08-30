/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Layers,
    CheckSquare,
    CheckCircle2,
    Clock,
    UserPlus,
    Briefcase,
    Loader2,
    AlertCircle,
    Mail,
    ExternalLink,
    Check,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { getPitchForSpecificUser } from '@/lib/api/myPitch';
import { getWorkspaceTasks } from '@/lib/api/tasks';
import { getOwnerIncomingRequests } from '@/lib/api/joinRequest';

export default function StudentDashboardPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || session?.user?._id || '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dashboard Data States
    const [assignedPitches, setAssignedPitches] = useState([]);
    const [workspaceTasks, setWorkspaceTasks] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Fetch pitches assigned to / associated with the user
            const pitchRes = await getPitchForSpecificUser(userId);
            const userPitches = pitchRes?.success
                ? (pitchRes.data || pitchRes.pitches || [])
                : (Array.isArray(pitchRes) ? pitchRes : (pitchRes?.data || []));
            setAssignedPitches(userPitches);

            // 2. Fetch tasks for each pitch workspace
            let allTasks = [];
            for (const pitch of userPitches) {
                const wsId = pitch.workspaceId || pitch._id || pitch.id;
                if (wsId) {
                    const taskRes = await getWorkspaceTasks(wsId);
                    const tasksData = taskRes?.success
                        ? (taskRes.data || taskRes.tasks || [])
                        : (Array.isArray(taskRes) ? taskRes : (taskRes?.data || []));

                    if (Array.isArray(tasksData)) {
                        const enrichedTasks = tasksData.map(t => ({
                            ...t,
                            workspaceId: wsId,
                            pitchId: pitch._id || pitch.id
                        }));
                        allTasks = [...allTasks, ...enrichedTasks];
                    }
                }
            }
            setWorkspaceTasks(allTasks);

            // 3. Fetch joining requests for pitches created/owned by this student
            const requestRes = await getOwnerIncomingRequests(userId);
            const requestsData = requestRes?.success
                ? (requestRes.data || requestRes.requests || [])
                : (Array.isArray(requestRes) ? requestRes : (requestRes?.data || []));
            setIncomingRequests(requestsData);

        } catch (err) {
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Stat Calculations
    const totalAssignedPitch = assignedPitches.length;
    const totalSelfAssignedTask = workspaceTasks.length;
    const totalCompletedTask = workspaceTasks.filter(
        (task) => {
            const status = (task.status || task.state || '').toUpperCase();
            return status === 'COMPLETED' || status === 'DONE';
        }
    ).length;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] text-gray-400">
                <Loader2 size={38} className="animate-spin text-indigo-500 mb-3" />
                <p className="text-sm font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center max-w-xl mx-auto my-12">
                <AlertCircle size={28} className="mx-auto mb-2" />
                <p className="text-sm font-medium mb-3">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Page Header */}
            <div className="border-b border-slate-800/80 pb-6 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Student Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Welcome back! Here is an overview of your active pitches, tasks, and incoming team requests.
                </p>
            </div>

            {/* 1. Stat Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Total Assigned Pitch */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Pitches</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">{totalAssignedPitch}</h3>
                    </div>
                    <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                        <Layers size={24} />
                    </div>
                </div>

                {/* Total Tasks */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">{totalSelfAssignedTask}</h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                        <CheckSquare size={24} />
                    </div>
                </div>

                {/* Total Completed Tasks */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Tasks</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">{totalCompletedTask}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {/* 2. Two-Column Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Side: New Assigned Tasks */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <CheckSquare size={18} className="text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">New Assigned Tasks</h2>
                        </div>
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
                            {workspaceTasks.slice(0, 4).length}
                        </span>
                    </div>

                    <div className="space-y-3 flex-1">
                        {workspaceTasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                No assigned tasks found.
                            </div>
                        ) : (
                            workspaceTasks.slice(0, 4).map((task) => (
                                <div
                                    key={task._id || task.id}
                                    className="bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 rounded-xl p-4 transition flex flex-col gap-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-semibold text-white line-clamp-1">{task.title || task.name}</h4>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 ${(task.status || '').toUpperCase() === 'COMPLETED'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {task.status || 'Pending'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-gray-500">
                                        <span>Priority: <span className="text-gray-300 font-medium capitalize">{task.priority || 'Normal'}</span></span>
                                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>

                                        {/* Workspace View Button (No background color) */}
                                        <Link
                                            href={`/dashboard/student/my-pitches/${task.workspaceId || task._id}/workspace`}
                                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition"
                                        >
                                            View <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side: Joining Requests at My Created Pitch */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <UserPlus size={18} className="text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">Pitch Joining Requests</h2>
                        </div>
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
                            {incomingRequests.slice(0, 4).length}
                        </span>
                    </div>

                    <div className="space-y-3 flex-1">
                        {incomingRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                No incoming join requests for your pitches.
                            </div>
                        ) : (
                            incomingRequests.slice(0, 4).map((req) => (
                                <div
                                    key={req.requestId || req._id}
                                    className="bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 rounded-xl p-4 transition flex flex-col gap-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">
                                                {req.applicantName || req.userName || req.user?.name || 'Unknown Applicant'}
                                            </h4>
                                            <p className="text-xs text-indigo-300 flex items-center gap-1 mt-0.5">
                                                <Mail size={12} /> {req.email || req.applicantEmail || req.user?.email || 'No email provided'}
                                            </p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            {req.status || 'Pending'}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
                                        <span className="text-gray-500 block mb-0.5 font-medium">Pitch: <strong className="text-white">{req.pitchTitle || req.pitch?.title}</strong></span>
                                        <p className="italic text-gray-400 line-clamp-2">&quot;{req.message || 'No statement provided.'}&quot;</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                                        <span className="text-gray-500">Role: <strong className="text-gray-300">{req.role || 'Developer'}</strong></span>

                                        <Link
                                            href={`/pitches/${req.pitchId || req.pitch?._id}`}
                                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition"
                                        >
                                            View Pitch <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}