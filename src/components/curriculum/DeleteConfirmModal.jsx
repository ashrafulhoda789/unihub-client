export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, isDeleting }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-[#0d1527] border border-slate-800 p-6 shadow-2xl text-slate-200 space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-lg">
                        ⚠️
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Delete Confirmation</h3>
                        <p className="text-xs text-slate-400">Are you sure you want to delete this resource?</p>
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-300">
                    <span className="text-indigo-400 font-medium">Target:</span> {title || 'Selected Resource'}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}