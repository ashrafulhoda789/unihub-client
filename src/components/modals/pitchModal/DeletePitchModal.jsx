"use client";

import { AlertTriangle } from "lucide-react";

export default function DeletePitchModal({ isOpen, onClose, onConfirm, title, deleting }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 text-red-400">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Delete Pitch?</h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">{title}</span>? This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Yes, Delete Pitch"}
                    </button>
                </div>
            </div>
        </div>
    );
}