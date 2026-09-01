/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, ShieldCheck, ArrowRight, Lock, Clock, UserPlus, ShieldAlert, Crown, AlertTriangle, Loader2 } from "lucide-react";
import { finalizePitchTeam } from "@/lib/action/createPitch";

export default function PitchCard({ pitch, onUpdate, currentUserId, currentUserRole }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isOwner = pitch.createdBy?.toString() === currentUserId?.toString();

    // Check if role is faculty/teacher (case-insensitive check)
    const isTeacher = currentUserRole?.toLowerCase() === "faculty" || currentUserRole?.toLowerCase() === "teacher";

    // Dynamic Workspace URL based on role
    const workspaceUrl = isTeacher
        ? `/dashboard/faculty/my-pitches/${pitch.workspaceId || pitch._id}/workspace`
        : `/dashboard/student/my-pitches/${pitch.workspaceId || pitch._id}/workspace`;

    const handleCardClick = () => {
        const baseDashboard = isTeacher ? `/dashboard/faculty/my-pitches` : `/dashboard/student/my-pitches`;
        router.push(`${baseDashboard}/${pitch._id}`);
    };

    const openModal = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setIsModalOpen(false);
    };

    const handleConfirmFinalize = async (e) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            const res = await finalizePitchTeam(pitch._id);
            if (res?.success) {
                onUpdate();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error finalizing pitch team:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const pendingRequestsCount = pitch.joinRequests?.filter(r => r.status === "PENDING").length || 0;

    return (
        <>
            <div
                onClick={handleCardClick}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all relative flex flex-col justify-between cursor-pointer hover:bg-slate-900/90 group"
            >
                <div>
                    {/* Category & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                                {pitch.category}
                            </span>

                            {/* OWN BADGE */}
                            {isOwner && (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                    <Crown className="w-3 h-3 text-amber-400" /> OWN
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {pendingRequestsCount > 0 && (
                                <span
                                    title={`${pendingRequestsCount} pending join request(s)`}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>{pendingRequestsCount}</span>
                                </span>
                            )}

                            {pitch.isFinalized ? (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                    <Lock className="w-3 h-3" /> ACTIVE
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold">
                                    <Clock className="w-3 h-3" /> {pitch.status}
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{pitch.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4">{pitch.description}</p>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {pitch.requiredSkills?.map((skill, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700/50">
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Supervisor Status */}
                    <div className="mb-4 text-xs bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Supervisor:
                        </span>
                        <span className={`font-semibold ${pitch.supervisionStatus === "ACCEPTED" ? "text-emerald-400" : "text-slate-400"}`}>
                            {pitch.supervisionStatus}
                        </span>
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-400" /> Members ({pitch.members?.length || 1})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {pitch.members?.map((m, idx) => (
                                <span key={idx} className="text-[11px] px-2.5 py-1 bg-slate-800/80 rounded-lg text-slate-200 border border-slate-700/60">
                                    {m.roleInTeam}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-800/80">
                    {pitch.isFinalized ? (
                        <Link
                            href={workspaceUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Enter Agile Workspace <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <button
                            onClick={openModal}
                            className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Finalize Team & Lock
                        </button>
                    )}
                </div>
            </div>

            {/* Finalize Confirmation Modal */}
            {isModalOpen && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                                <AlertTriangle className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Finalize Team Confirmation</h3>
                                <p className="text-xs text-slate-400">Are you sure you want to proceed?</p>
                            </div>
                        </div>

                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-6 space-y-2">
                            <p className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Locks member recruitment for this project.
                            </p>
                            <p className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Marks project status as <strong className="text-emerald-400">ACTIVE</strong>.
                            </p>
                            <p className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Creates your dedicated Private Agile Workspace.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={closeModal}
                                disabled={isLoading}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmFinalize}
                                disabled={isLoading}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Finalizing...
                                    </>
                                ) : (
                                    "Confirm & Finalize"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}