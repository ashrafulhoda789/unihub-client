"use client";

import { FilePlus, X } from "lucide-react";

export default function CreateFileModal({
    isOpen,
    onClose,
    fileName,
    setFileName,
    onConfirm,
    error,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0e172a] border border-slate-800 w-full max-w-md rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <FilePlus className="w-5 h-5" />
                        <h3 className="text-sm font-semibold text-slate-100">Create New File</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={onConfirm} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            File Name (with extension)
                        </label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="e.g., main.cpp, script.py, Main.java"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full px-3 py-2 bg-[#060b19] border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        {error && <p className="text-[11px] text-rose-400 mt-1.5">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
                        >
                            Create File
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}