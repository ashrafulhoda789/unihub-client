"use client";

import { Eye, Calendar, User, FileText, CheckCircle2, Clock, AlertCircle, Paperclip } from "lucide-react";

const STATUS_CONFIG = {
    TODO: { label: "To Do", bg: "bg-slate-800/80 text-slate-300 border-slate-700" },
    IN_PROGRESS: { label: "In Progress", bg: "bg-blue-950/80 text-blue-400 border-blue-800/60" },
    IN_REVIEW: { label: "In Review", bg: "bg-purple-950/80 text-purple-400 border-purple-800/60" },
    DONE: { label: "Done", bg: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60" },
    BACKLOG: { label: "Backlog", bg: "bg-rose-950/80 text-rose-400 border-rose-800/60" }
};

export default function TaskDetailModal({
    isOpen,
    onClose,
    task,
    isSupervisor,
    onStatusChange
}) {
    if (!isOpen || !task) return null;

    const currentStatus = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;

    const initialFileUrl = Array.isArray(task.attachments) && task.attachments.length > 0
        ? task.attachments[0]
        : task.attachmentUrl || task.fileUrl;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0b1329] border border-slate-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header: Title & Close button */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div className="space-y-1.5 pr-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${currentStatus.bg}`}>
                            {task.status === "DONE" && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {task.status === "BACKLOG" && <AlertCircle className="w-3.5 h-3.5" />}
                            {(task.status === "IN_PROGRESS" || task.status === "IN_REVIEW") && <Clock className="w-3.5 h-3.5" />}
                            {currentStatus.label}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                            {task.title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 text-lg p-1.5 rounded-lg hover:bg-slate-800/60 transition shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1 text-slate-300 custom-scrollbar">

                    {/* Description */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span>Description</span>
                        </div>
                        <div className="bg-[#060b19] border border-slate-800/90 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {task.description || <span className="italic text-slate-500">No description provided.</span>}
                        </div>
                    </div>

                    {/* Task Attachment (ক্রিয়েট করার সময় আপলোড করা ফাইল) */}
                    {initialFileUrl && (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Paperclip className="w-4 h-4 text-indigo-400" />
                                <span>Attached File</span>
                            </div>
                            <div className="bg-[#060b19] border border-slate-800/90 rounded-xl p-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg">📁</span>
                                    <span className="text-xs text-slate-300 font-medium truncate">
                                        Task Resource / Instruction File
                                    </span>
                                </div>
                                <a
                                    href={initialFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1 shrink-0 bg-indigo-950/40 border border-indigo-800/50 px-2.5 py-1 rounded-lg transition"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View / Download</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Meta Grid: Assignees & Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Assignees */}
                        <div className="bg-[#060b19] border border-slate-800/90 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <User className="w-4 h-4 text-indigo-400" />
                                <span>Assignees ({task.assigneeDetails?.length || 0})</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {task.assigneeDetails && task.assigneeDetails.length > 0 ? (
                                    task.assigneeDetails.map((assignee, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full px-2.5 py-1 text-[11px]"
                                        >
                                            <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                                                {assignee.name ? assignee.name.charAt(0) : "U"}
                                            </div>
                                            <span className="text-slate-200 font-medium truncate max-w-[100px]">
                                                {assignee.name || "User"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-500 italic">No assignees</span>
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="bg-[#060b19] border border-slate-800/90 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span>Due Date</span>
                            </div>
                            <p className="text-xs text-slate-200 font-semibold pt-1">
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })
                                    : "No due date set"}
                            </p>
                        </div>
                    </div>

                    {/* Submission / Proof Link (কাজ জমা দেওয়ার সময় দেওয়া ফাইল) */}
                    {task.submissionUrl && (
                        <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                                    <span>🚀</span> Submitted Proof
                                </span>
                                <a
                                    href={task.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-lg transition"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Proof</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls: Change Status */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-slate-400 shrink-0">Change Status:</span>
                        <select
                            value={task.status}
                            onChange={(e) => onStatusChange(task, e.target.value)}
                            className="bg-[#060b19] border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer w-full sm:w-auto"
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="IN_REVIEW">In Review</option>
                            {isSupervisor && <option value="DONE">Done</option>}
                        </select>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}