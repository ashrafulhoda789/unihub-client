"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    fileName,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0e172a] border border-slate-800 w-full max-w-sm rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-sm font-semibold text-slate-100">Delete File</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-xs text-slate-300">
                    Are you sure you want to delete <span className="font-semibold text-indigo-400">{fileName}</span>? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-rose-600/20 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}