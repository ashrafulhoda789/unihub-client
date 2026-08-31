'use client';

import { useState } from 'react';

export default function ClassroomCard({ item, onEdit, onDelete }) {
    const [previewFile, setPreviewFile] = useState(null);

    const getCategoryBadgeStyle = (category) => {
        switch (category?.toLowerCase()) {
            case 'outline':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'mid':
            case 'midterm':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'final':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        }
    };

    const getCategoryLabel = (category) => {
        switch (category?.toLowerCase()) {
            case 'book':
                return 'Book';
            case 'mid':
            case 'midterm':
                return 'Midterm';
            case 'final':
                return 'Final Exam';
            default:
                return category || 'Classroom';
        }
    };

    const category = item.classroomCategory || item.category;

    return (
        <>
            {/* CARD */}
            <div className="w-full min-w-0 bg-[#0d1527]/80 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-4 sm:p-5 flex flex-col justify-between shadow-lg overflow-hidden">

                {/* TOP CONTENT */}
                <div className="min-w-0">

                    {/* Category + Academic Info */}
                    <div className="flex flex-col gap-2 mb-3 min-w-0">

                        <div className="flex items-center justify-between gap-2 min-w-0">
                            <span
                                className={`inline-flex w-fit max-w-full px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border uppercase tracking-wider whitespace-nowrap ${getCategoryBadgeStyle(category)} truncate`}
                            >
                                {getCategoryLabel(category)}
                            </span>

                            <span className="text-[10px] sm:text-xs text-slate-400 font-medium text-right shrink-0">
                                {item.department}
                            </span>
                        </div>

                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                            {item.semester} Semester
                            {item.year ? ` • ${item.year}` : ''}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 break-words leading-snug">
                        {item.title}
                    </h3>

                    {/* Course */}
                    <p className="text-xs font-medium text-indigo-400 mb-2 mt-1 break-words leading-relaxed">
                        {item.courseName}
                        {item.courseId ? ` (${item.courseId})` : ''}
                    </p>

                    {/* Description */}
                    {item.description && (
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed break-words">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* BOTTOM CONTENT */}
                <div className="pt-4 border-t border-slate-800 space-y-3">

                    {/* Attachments */}
                    {item.resources && item.resources.length > 0 ? (
                        <div className="space-y-1.5 min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Attachments ({item.resources.length})
                            </p>

                            <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                                {item.resources.map((res, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setPreviewFile(res)}
                                        className="w-full min-w-0 flex items-center justify-between gap-2 text-xs bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 p-2 rounded-xl cursor-pointer transition-all group text-left"
                                    >
                                        <span className="text-indigo-300 truncate min-w-0 group-hover:text-indigo-200">
                                            📄 {res.fileName || `Attachment ${idx + 1}`}
                                        </span>

                                        <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 font-medium shrink-0">
                                            Preview
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : item.fileUrl ? (
                        <button
                            type="button"
                            onClick={() =>
                                setPreviewFile({
                                    fileUrl: item.fileUrl,
                                    fileName: item.title,
                                })
                            }
                            className="w-full min-w-0 flex items-center justify-between gap-2 text-xs bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 p-2.5 rounded-xl cursor-pointer transition-all text-left"
                        >
                            <span className="text-indigo-300 truncate min-w-0">
                                📄 View Attached Document
                            </span>

                            <span className="text-[10px] text-indigo-400 font-medium shrink-0">
                                Preview
                            </span>
                        </button>
                    ) : null}

                    {/* Resource Link */}
                    {item.resourceLink && (
                        <a
                            href={item.resourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center text-xs py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 text-indigo-400 font-medium rounded-xl border border-slate-700/50 transition-colors truncate"
                        >
                            🔗 Reference Link
                        </a>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="w-full px-3 py-2 sm:py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-medium rounded-lg border border-amber-500/20 transition-colors"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(item._id, item.title)}
                            className="w-full px-3 py-2 sm:py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg border border-red-500/20 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">

                    <div className="w-full max-w-4xl h-[92vh] sm:h-[85vh] rounded-xl sm:rounded-2xl bg-[#0d1527] border border-slate-800 flex flex-col shadow-2xl overflow-hidden text-slate-200">

                        {/* Modal Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/50">

                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                                    {previewFile.fileName || item.title}
                                </h3>

                                <p className="text-[10px] sm:text-xs text-indigo-400 mt-0.5">
                                    Document Preview
                                </p>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">

                                <a
                                    href={previewFile.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 sm:flex-none text-center px-3 py-2 sm:py-1.5 text-[10px] sm:text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors whitespace-nowrap"
                                >
                                    Open in New Tab ↗
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold shrink-0"
                                    aria-label="Close preview"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Iframe */}
                        <div className="flex-1 min-h-0 bg-slate-950 p-1.5 sm:p-2">
                            <iframe
                                src={previewFile.fileUrl}
                                className="w-full h-full rounded-lg sm:rounded-xl border border-slate-800"
                                title="Resource Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}