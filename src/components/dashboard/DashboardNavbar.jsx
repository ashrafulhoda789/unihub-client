"use client";

import { useSession } from "@/lib/auth-client";
import { Search, Bell, Sparkles, ShieldCheck, UserCheck } from "lucide-react";

export default function DashboardNavbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const userRole = (user?.role || "").toLowerCase();
    const isAdmin = userRole === "admin";
    const isFaculty = userRole === "faculty";

    return (
        <header className="hidden md:flex h-16 bg-slate-900/80 border-b border-slate-800 px-6 items-center justify-between sticky top-0 z-30 backdrop-blur-md">

            {/* Left: Global Workspace Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search workspace, pitches, tasks..."
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions, Badges & Profile */}
            <div className="flex items-center gap-4">

                {/* Academic Session Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fall 2026 Session</span>
                </div>

                {/* Notifications Bell */}
                <button
                    title="Notifications"
                    className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                </button>

                {/* Divider */}
                <div className="h-6 w-[1px] bg-slate-800" />

                {/* User Summary */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                        {user?.name ? user.name[0] : "U"}
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-semibold text-white leading-tight">{user?.name || "User Account"}</p>
                        <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                            {isAdmin ? (
                                <span className="text-rose-400 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Admin</span>
                            ) : isFaculty ? (
                                <span className="text-cyan-400 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Faculty</span>
                            ) : (
                                <span className="text-indigo-400 flex items-center gap-0.5"><UserCheck className="w-3 h-3" /> Student</span>
                            )}
                        </p>
                    </div>
                </div>

            </div>
        </header>
    );
}