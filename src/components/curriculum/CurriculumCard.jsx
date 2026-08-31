'use client';

export default function CurriculumCard({ item, onEdit, onDelete }) {
    const getBadgeStyle = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'video':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'slide':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="w-full min-w-0 bg-[#0d1527]/80 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-4 sm:p-5 flex flex-col justify-between shadow-lg overflow-hidden">

            {/* TOP CONTENT */}
            <div className="min-w-0">

                {/* Document Type + Academic Info */}
                <div className="flex flex-col gap-2 mb-3 min-w-0">

                    <div className="flex items-center justify-between gap-2 min-w-0">
                        <span
                            className={`inline-flex w-fit max-w-full px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border uppercase tracking-wider whitespace-nowrap truncate ${getBadgeStyle(item.documentType)}`}
                        >
                            {item.documentType || 'Document'}
                        </span>

                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium text-right shrink-0">
                            {item.department}
                        </span>
                    </div>

                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                        {item.semester} Semester
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 break-words leading-snug">
                    {item.title}
                </h3>

                {/* Course */}
                <p className="text-xs font-medium text-blue-400 mb-2 mt-1 break-words leading-relaxed">
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

                {/* Links */}
                {(item.fileUrl || item.resourceLink) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">

                        {item.fileUrl && (
                            <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full text-center py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-700/50 transition-colors truncate"
                            >
                                📄 Attachment
                            </a>
                        )}

                        {item.resourceLink && (
                            <a
                                href={item.resourceLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full text-center py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 text-blue-400 font-medium rounded-xl border border-slate-700/50 transition-colors truncate"
                            >
                                🔗 Resource Link
                            </a>
                        )}
                    </div>
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
    );
}