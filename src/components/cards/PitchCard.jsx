"use client";

import Link from "next/link";
import { Users, ShieldCheck, Check, X, ArrowRight, Lock, Clock, UserPlus, ShieldAlert } from "lucide-react";

export default function PitchCard({ pitch, onUpdate }) {

    // Privacy Seal: Finalize Team
    const handleFinalizeTeam = async () => {
        if (!confirm("Finalize team? This will lock member recruitment, mark project as ACTIVE, and create your Private Agile Workspace.")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/pitches/${pitch._id}/finalize`, {
                method: "PATCH",
            });
            if (res.ok) onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    // Peer Request Action
    const handleRequestAction = async (requestId, action) => {
        try {
            const res = await fetch(`http://localhost:5000/api/pitches/${pitch._id}/request-action`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action, roleInTeam: "Developer" }),
            });
            if (res.ok) onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const pendingRequests = pitch.joinRequests?.filter(r => r.status === "PENDING") || [];

    return (
        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all relative flex flex-col justify-between">
            <div>
                {/* Category & Status Badges */}
                <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                        {pitch.category}
                    </span>

                    <div className="flex items-center gap-2">
                        {pitch.isFinalized ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                <Lock className="w-3 h-3" /> ACTIVE
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                <Clock className="w-3 h-3" /> {pitch.status}
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{pitch.title}</h3>
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

                {/* Join Requests */}
                {!pitch.isFinalized && pendingRequests.length > 0 && (
                    <div className="p-3 bg-slate-800/40 border border-indigo-500/20 rounded-xl mb-4">
                        <h5 className="text-xs font-semibold text-indigo-300 mb-2 flex items-center gap-1">
                            <UserPlus className="w-3.5 h-3.5" /> Peer Join Requests ({pendingRequests.length})
                        </h5>
                        <div className="space-y-2">
                            {pendingRequests.map((req) => (
                                <div key={req._id} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg">
                                    <p className="text-slate-300 text-[11px] truncate max-w-[150px]">{req.message}</p>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleRequestAction(req._id, "ACCEPTED")}
                                            className="p-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(req._id, "REJECTED")}
                                            className="p-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-800/80">
                {pitch.isFinalized ? (
                    <Link
                        href={`/dashboard/student/workspace/${pitch.workspaceId || pitch._id}`}
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