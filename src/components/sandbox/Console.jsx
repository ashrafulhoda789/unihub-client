"use client";

import { Terminal } from "lucide-react";

export default function ConsoleOutput({ output, isRunning, error }) {
    return (
        <div className="w-full h-full flex flex-col bg-[#060b19] font-mono text-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#080d1e] border-b border-slate-800 text-slate-400 select-none shrink-0">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">Console Output</span>
            </div>

            {/* Output Body */}
            <div className="flex-1 p-4 overflow-y-auto text-slate-200">
                {isRunning ? (
                    <p className="text-amber-400 animate-pulse">Running code...</p>
                ) : error ? (
                    <pre className="text-rose-400 whitespace-pre-wrap font-mono">{error}</pre>
                ) : (
                    <pre className="text-slate-200 whitespace-pre-wrap font-mono">{output || "No output yet."}</pre>
                )}
            </div>
        </div>
    );
}