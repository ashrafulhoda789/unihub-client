"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none -top-32 -left-32 animate-pulse" />

            <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10">

                {/* Icon Badge - Warning Theme */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                    <Lock className="w-10 h-10" />
                </div>

                {/* Error Code & Title */}
                <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold tracking-widest uppercase">
                        Error 403 • Forbidden
                    </span>
                    <h1 className="text-2xl font-bold text-white">
                        Access Denied
                    </h1>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        You do not have the necessary permissions or role required to access this restricted area.
                    </p>
                </div>

                {/* Action Buttons - Indigo Theme */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>

                    <Link
                        href="/"
                        className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-colors"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </Link>
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
                    If you believe this is an error, please contact the administrator.
                </div>

            </div>
        </div>
    );
}