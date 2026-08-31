"use client";

import Link from "next/link";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Glow Effect */}
            <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl relative z-10">

                {/* Warning Icon Badge */}
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/10">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                {/* Error Code */}
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    Error 404
                </span>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mt-4 mb-2">
                    Page Not Found
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>

                    <Link
                        href="/"
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Home Page
                    </Link>
                </div>

            </div>
        </main>
    );
}