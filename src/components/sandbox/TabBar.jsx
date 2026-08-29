"use client";

import { File, X } from "lucide-react";

export default function TabBar({ files, openFileIds, activeFileId, onSelectFile, onCloseTab }) {
    return (
        <div className="flex items-center bg-[#060b19] border-b border-slate-800 overflow-x-auto">
            {openFileIds.map((fileId) => {
                const file = files[fileId];
                if (!file) return null;
                const isActive = fileId === activeFileId;

                return (
                    <div
                        key={fileId}
                        onClick={() => onSelectFile(fileId)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs border-r border-slate-800 cursor-pointer group select-none transition-colors ${isActive
                                ? "bg-[#0b1329] text-indigo-400 font-medium border-t-2 border-t-indigo-500"
                                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                            }`}
                    >
                        <File className="w-3.5 h-3.5" />
                        <span>{file.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(fileId);
                            }}
                            className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}