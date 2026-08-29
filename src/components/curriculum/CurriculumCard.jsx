'use client';

export default function CurriculumCard({ item, onEdit, onDelete }) {
    const getBadgeStyle = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'video': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'slide': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="bg-[#0d1527]/80 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between shadow-lg">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${getBadgeStyle(item.documentType)}`}>
                        {item.documentType}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {item.department} • {item.semester} Sem
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs font-medium text-blue-400 mb-2 mt-0.5">{item.courseName} ({item.courseId})</p>

                {item.description && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                )}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex gap-2 text-xs">
                    {item.fileUrl && (
                        <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 text-center py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-700/50 transition-colors"
                        >
                            📄 Attachment
                        </a>
                    )}
                    {item.resourceLink && (
                        <a
                            href={item.resourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 text-center py-2 bg-slate-800/60 hover:bg-slate-800 text-blue-400 font-medium rounded-xl border border-slate-700/50 transition-colors"
                        >
                            🔗 Resource Link
                        </a>
                    )}
                </div>

                <div className="flex justify-end gap-2 text-xs pt-1">
                    <button
                        onClick={() => onEdit(item)}
                        className="px-3.5 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-medium rounded-lg border border-amber-500/20 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(item._id)}
                        className="px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg border border-red-500/20 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}