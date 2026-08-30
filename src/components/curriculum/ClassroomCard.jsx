'use client';

import { useState } from 'react';

export default function ClassroomCard({ item, onEdit, onDelete }) {
    const [previewFile, setPreviewFile] = useState(null);

    // Classroom Specific Badges (Outline, Midterm, Final Exam)
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
            case 'book': return 'Book';
            case 'mid':
            case 'midterm': return 'Midterm';
            case 'final': return 'Final Exam';
            default: return category || 'Classroom';
        }
    };

    return (
        <>
            <div className="bg-[#0d1527]/80 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between shadow-lg">
                <div>
                    {/* Header: Category Badge & Dept/Semester */}
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${getCategoryBadgeStyle(item.classroomCategory || item.category)}`}>
                            {getCategoryLabel(item.classroomCategory || item.category)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            {item.department} • {item.semester} Sem {item.year ? `(${item.year})` : ''}
                        </span>
                    </div>

                    {/* Title & Course Info */}
                    <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs font-medium text-indigo-400 mb-2 mt-0.5">
                        {item.courseName} {item.courseId ? `(${item.courseId})` : ''}
                    </p>

                    {/* Description */}
                    {item.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Bottom Section: Attachments & Actions */}
                <div className="pt-4 border-t border-slate-800 space-y-3">

                    {/* Multiple Resources / Attachments List */}
                    {item.resources && item.resources.length > 0 ? (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Attachments ({item.resources.length}):</p>
                            <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                                {item.resources.map((res, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setPreviewFile(res)}
                                        className="flex items-center justify-between text-xs bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 p-2 rounded-xl cursor-pointer transition-all group"
                                    >
                                        <span className="text-indigo-300 truncate max-w-[85%] group-hover:text-indigo-200">
                                            📄 {res.fileName || `Attachment ${idx + 1}`}
                                        </span>
                                        <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 font-medium">Preview</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : item.fileUrl ? (
                        /* Fallback for old single file */
                        <div
                            onClick={() => setPreviewFile({ fileUrl: item.fileUrl, fileName: item.title })}
                            className="flex items-center justify-between text-xs bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 p-2.5 rounded-xl cursor-pointer transition-all"
                        >
                            <span className="text-indigo-300 truncate">📄 View Attached Document</span>
                            <span className="text-[10px] text-indigo-400 font-medium">Preview</span>
                        </div>
                    ) : null}

                    {item.resourceLink && (
                        <a
                            href={item.resourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center text-xs py-2 bg-slate-800/60 hover:bg-slate-800 text-indigo-400 font-medium rounded-xl border border-slate-700/50 transition-colors"
                        >
                            🔗 Reference Link
                        </a>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 text-xs pt-1">
                        <button
                            onClick={() => onEdit(item)}
                            className="px-3.5 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-medium rounded-lg border border-amber-500/20 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(item._id, item.title)}
                            className="px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg border border-red-500/20 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl h-[85vh] rounded-2xl bg-[#0d1527] border border-slate-800 flex flex-col shadow-2xl overflow-hidden text-slate-200">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                            <div>
                                <h3 className="text-base font-bold text-white truncate max-w-lg">
                                    {previewFile.fileName || item.title}
                                </h3>
                                <p className="text-xs text-indigo-400">Document Preview</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewFile.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                                >
                                    Open in New Tab ↗
                                </a>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body (Iframe / Viewer) */}
                        <div className="flex-1 bg-slate-950 p-2">
                            <iframe
                                src={previewFile.fileUrl}
                                className="w-full h-full rounded-xl border border-slate-800"
                                title="Resource Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}