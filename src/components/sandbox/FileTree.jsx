"use client";

import { File, Plus, Trash2, CheckSquare, Square } from "lucide-react";

export default function FileTree({
    files,
    activeFileId,
    selectedFileIds,
    onSelectFile,
    onToggleSelect,
    onCreateFile,
    onDeleteFile
}) {
    return (
        <div className="w-64 bg-[#060b19] border-r border-slate-800 p-3 flex flex-col h-full text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Explorer</span>
                <button
                    onClick={onCreateFile}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    title="New File"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-1 overflow-y-auto flex-1">
                {Object.values(files)
                    .filter((f) => !f.isFolder)
                    .map((file) => {
                        const isActive = file.id === activeFileId;
                        const isChecked = selectedFileIds.includes(file.id);

                        return (
                            <div
                                key={file.id}
                                onClick={() => onSelectFile(file.id)}
                                className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer group transition-colors ${isActive ? "bg-indigo-600/20 text-indigo-400 font-semibold" : "hover:bg-slate-800/60"
                                    }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {/* Selection Checkbox */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleSelect(file.id);
                                        }}
                                        className="text-slate-500 hover:text-indigo-400"
                                    >
                                        {isChecked ? (
                                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                                        ) : (
                                            <Square className="w-4 h-4 text-slate-600" />
                                        )}
                                    </button>

                                    <File className="w-4 h-4 shrink-0 text-slate-400" />
                                    <span className="truncate">{file.name}</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteFile(file.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}