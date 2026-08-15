
"use client";

export default function PitchSidebar({ pitch }) {

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const status = pitch?.status || "ACTIVE";

    return (
        <div className="space-y-4">
            {/* 1. Project Header & Status Card */}
            <div className="p-4 bg-[#0b1329]/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Workspace
                    </span>
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${status === "ACTIVE"
                                    ? "bg-emerald-400 animate-pulse"
                                    : "bg-amber-400"
                                }`}
                        ></span>
                        {status}
                    </span>
                </div>
                <h2 className="text-sm font-bold text-slate-100 truncate">
                    {pitch?.title || "Untitled Project"}
                </h2>
            </div>

            {/* 2. Timeline Card (Created & Expires Date) */}
            <div className="p-4 bg-[#0b1329]/80 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span>📅</span> Timeline
                </h3>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b19] border border-slate-800/80">
                        <span className="text-slate-400">Created At</span>
                        <span className="font-medium text-slate-200">
                            {formatDate(pitch?.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b19] border border-slate-800/80">
                        <span className="text-slate-400">Expires At</span>
                        <span className="font-medium text-amber-300">
                            {formatDate(pitch?.expiresAt)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Team Members Card */}
            <div className="p-4 bg-[#0b1329]/80 border border-slate-800 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <span>👥</span> Members ({pitch?.members?.length || 0})
                </h3>

                {pitch?.members && pitch.members.length > 0 ? (
                    <div className="space-y-2.5">
                        {pitch.members.map((member, idx) => (
                            <div
                                key={member._id || idx}
                                className="flex items-center space-x-3 p-2.5 rounded-lg bg-[#060b19] border border-slate-800/80 hover:border-slate-700 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                                    {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-slate-200 truncate">
                                        {member.name || "Team Member"}
                                    </p>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 inline-block mt-0.5 truncate">
                                        {member.roleInTeam || member.role || "Member"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-500 italic">No members assigned yet.</p>
                )}
            </div>
        </div>
    );
}