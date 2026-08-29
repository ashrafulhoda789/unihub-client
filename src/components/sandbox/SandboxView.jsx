"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, Play, FolderTree, X } from "lucide-react";
import { initialFiles } from "@/lib/constants/initialFiles";
import FileTree from "./FileTree";
import CodeEditor from "./Editor";
import ConsoleOutput from "./Console";
import TabBar from "./TabBar";
import CreateFileModal from "./CreateFileModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function SandboxView() {
    const [files, setFiles] = useState(initialFiles);
    const [activeFileId, setActiveFileId] = useState("file-1");
    const [openFileIds, setOpenFileIds] = useState(["file-1", "file-2", "file-3"]);
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Responsive Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Selection State
    const [selectedFileIds, setSelectedFileIds] = useState([]);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fileToDeleteId, setFileToDeleteId] = useState(null);
    const [newFileName, setNewFileName] = useState("");
    const [modalError, setModalError] = useState("");

    const activeFile = files[activeFileId];

    const handleToggleSelect = (fileId) => {
        setSelectedFileIds((prev) =>
            prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
        );
    };

    const handleDownloadSelected = async () => {
        if (selectedFileIds.length === 0) return;

        if (selectedFileIds.length === 1) {
            const file = files[selectedFileIds[0]];
            if (!file) return;

            const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return;
        }

        const zip = new JSZip();
        selectedFileIds.forEach((fileId) => {
            const file = files[fileId];
            if (file) {
                zip.file(file.name, file.content);
            }
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "selected-files.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getLanguageFromExtension = (fileName) => {
        const ext = fileName?.split('.').pop().toLowerCase();
        switch (ext) {
            case 'cpp':
            case 'cc':
            case 'cxx':
                return { lang: 'c++', monacoLang: 'cpp' };
            case 'c':
                return { lang: 'c', monacoLang: 'c' };
            case 'java':
                return { lang: 'java', monacoLang: 'java' };
            case 'py':
                return { lang: 'python', monacoLang: 'python' };
            case 'js':
                return { lang: 'javascript', monacoLang: 'javascript' };
            case 'ts':
                return { lang: 'typescript', monacoLang: 'typescript' };
            default:
                return { lang: 'javascript', monacoLang: 'javascript' };
        }
    };

    const handleSelectFile = (fileId) => {
        setActiveFileId(fileId);
        if (!openFileIds.includes(fileId)) {
            setOpenFileIds((prev) => [...prev, fileId]);
        }
        setIsSidebarOpen(false);
    };

    const handleCloseTab = (fileId) => {
        const newOpenTabs = openFileIds.filter((id) => id !== fileId);
        setOpenFileIds(newOpenTabs);
        if (activeFileId === fileId && newOpenTabs.length > 0) {
            setActiveFileId(newOpenTabs[newOpenTabs.length - 1]);
        }
    };

    const handleCodeChange = (newContent) => {
        if (!activeFileId) return;
        setFiles((prev) => ({
            ...prev,
            [activeFileId]: {
                ...prev[activeFileId],
                content: newContent,
            },
        }));
    };

    const handleOpenCreateModal = () => {
        setNewFileName("");
        setModalError("");
        setIsCreateModalOpen(true);
    };

    const handleConfirmCreateFile = (e) => {
        e.preventDefault();
        const trimmedName = newFileName.trim();

        if (!trimmedName) {
            setModalError("File name cannot be empty!");
            return;
        }

        const isDuplicate = Object.values(files).some(
            (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            setModalError("A file with this name already exists!");
            return;
        }

        const { monacoLang } = getLanguageFromExtension(trimmedName);
        const newId = `file-${Date.now()}`;
        const newFile = {
            id: newId,
            name: trimmedName,
            isFolder: false,
            content: `// File: ${trimmedName}\n`,
            language: monacoLang,
        };

        setFiles((prev) => ({ ...prev, [newId]: newFile }));
        setOpenFileIds((prev) => [...prev, newId]);
        setActiveFileId(newId);
        setIsCreateModalOpen(false);
        setIsSidebarOpen(false);
    };

    const handleOpenDeleteModal = (fileId) => {
        if (Object.keys(files).length <= 1) {
            alert("At least one file must be kept!");
            return;
        }
        setFileToDeleteId(fileId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteFile = () => {
        if (!fileToDeleteId) return;

        const updatedFiles = { ...files };
        delete updatedFiles[fileToDeleteId];

        setFiles(updatedFiles);
        setSelectedFileIds((prev) => prev.filter((id) => id !== fileToDeleteId));
        handleCloseTab(fileToDeleteId);
        setIsDeleteModalOpen(false);
        setFileToDeleteId(null);
    };

    const handleRunCode = async () => {
        if (!activeFile) return;

        setIsRunning(true);
        setOutput("");
        setError(null);

        const { lang } = getLanguageFromExtension(activeFile.name);

        try {
            const response = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: lang,
                    fileName: activeFile.name,
                    content: activeFile.content,
                }),
            });

            const data = await response.json();

            if (data.run) {
                if (data.run.stderr) setError(data.run.stderr);
                if (data.run.stdout) setOutput(data.run.stdout);
                else if (!data.run.stderr) setOutput("Program executed successfully with no output.");
            } else if (data.message || data.error) {
                setError(data.message || data.error);
            } else {
                setError("Execution failed. Please try again.");
            }
        } catch (err) {
            setError("Execution Error: " + err.message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#0b1329] text-slate-100 relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-[#060b19] px-3 md:px-6 py-2.5 border-b border-slate-800 gap-2 shrink-0 z-20">
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/60 rounded-lg transition-colors"
                        title="Toggle Files"
                    >
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <FolderTree className="w-4 h-4" />}
                    </button>

                    <h1 className="text-xs md:text-sm font-bold text-slate-200 truncate max-w-[140px] sm:max-w-none">
                        IDE Sandbox
                    </h1>

                    {activeFile && (
                        <span className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 uppercase font-semibold">
                            {getLanguageFromExtension(activeFile.name).lang}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadSelected}
                        disabled={selectedFileIds.length === 0}
                        title="Download Selected Files"
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/60 disabled:text-slate-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                        <span>({selectedFileIds.length})</span>
                    </button>

                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">{isRunning ? "Running..." : "Run Code"}</span>
                        <span className="sm:hidden">{isRunning ? "..." : "Run"}</span>
                    </button>
                </div>
            </div>

            {/* Main Workspace Container */}
            <div className="flex flex-1 w-full overflow-hidden relative">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    />
                )}

                {/* File Explorer Sidebar */}
                <aside
                    className={`
            fixed md:static z-40 md:z-auto
            top-14 bottom-0 left-0 md:top-auto md:bottom-auto md:left-auto
            h-[calc(100vh-3.5rem)] md:h-full w-64 md:w-64 bg-[#060b19] border-r border-slate-800
            transform transition-transform duration-200 ease-in-out shrink-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
                >
                    <FileTree
                        files={files}
                        activeFileId={activeFileId}
                        selectedFileIds={selectedFileIds}
                        onSelectFile={handleSelectFile}
                        onToggleSelect={handleToggleSelect}
                        onCreateFile={handleOpenCreateModal}
                        onDeleteFile={handleOpenDeleteModal}
                    />
                </aside>

                {/* Main Editor View */}
                <main className="flex-1 flex flex-col min-w-0 h-full bg-[#0b1329] overflow-hidden">
                    <TabBar
                        files={files}
                        openFileIds={openFileIds}
                        activeFileId={activeFileId}
                        onSelectFile={handleSelectFile}
                        onCloseTab={handleCloseTab}
                    />

                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Editor Workspace */}
                        <div className="flex-1 min-h-0 relative overflow-hidden">
                            {activeFile ? (
                                <CodeEditor
                                    code={activeFile.content}
                                    setCode={handleCodeChange}
                                    language={getLanguageFromExtension(activeFile.name).monacoLang}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                                    No file selected
                                </div>
                            )}
                        </div>

                        {/* Console Panel */}
                        <div className="h-44 md:h-52 shrink-0 border-t border-slate-800 overflow-hidden">
                            <ConsoleOutput output={output} isRunning={isRunning} error={error} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <CreateFileModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                fileName={newFileName}
                setFileName={(name) => {
                    setNewFileName(name);
                    setModalError("");
                }}
                onConfirm={handleConfirmCreateFile}
                error={modalError}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteFile}
                fileName={files[fileToDeleteId]?.name}
            />
        </div>
    );
}