"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, ShieldCheck, ArrowRight, Lock, Clock, UserPlus, ShieldAlert, Crown } from "lucide-react";
import { finalizePitchTeam } from "@/lib/action/createPitch";

export default function PitchCard({ pitch, onUpdate, currentUserId }) {
    const router = useRouter();

    const isOwner = pitch.createdBy?.toString() === currentUserId?.toString();

    const handleCardClick = () => {
        router.push(`/dashboard/student/my-pitches/${pitch._id}`);
    };

    const handleFinalizeTeam = async (e) => {
        e.stopPropagation();
        if (!confirm("Finalize team? This will lock member recruitment, mark project as ACTIVE, and create your Private Agile Workspace.")) return;

        try {
            const res = await finalizePitchTeam(pitch._id);
            if (res?.success) {
                onUpdate();
            }
        } catch (err) {
            console.error("Error finalizing pitch team:", err);
        }
    };

    const pendingRequestsCount = pitch.joinRequests?.filter(r => r.status === "PENDING").length || 0;

    return (
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
                        href={`/dashboard/student/workspace/${pitch.workspaceId || pitch._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Enter Agile Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                ) : (
                    <button
                        onClick={handleFinalizeTeam}
                        className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Finalize Team & Lock
                    </button>
                )}
            </div>
        </div>
    );
}