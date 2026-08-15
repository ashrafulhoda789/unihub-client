// src/components/dashboard/workspace/CreateTaskModal.jsx
"use client";

import { createTask } from "@/lib/action/tasks";
import { uploadToCloudinary } from "@/lib/upload";
import { Eye, File, Link } from "lucide-react";
import { useState } from "react";
import { BiRightArrow } from "react-icons/bi";

export default function CreateTaskModal({ isOpen, onClose, workspaceId, members, currentUserId, onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [assignedTo, setAssignedTo] = useState([]);
    const [dueDate, setDueDate] = useState("");

    // File upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const toggleAssignee = (userId) => {
        if (assignedTo.includes(userId)) {
            setAssignedTo(assignedTo.filter((id) => id !== userId));
        } else {
            setAssignedTo([...assignedTo, userId]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // আগের তৈরি করা Object URL ক্লিন করা
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }

        setSelectedFile(file);
        const localUrl = URL.createObjectURL(file);
        setFilePreviewUrl(localUrl);
    };

    const handleRemoveFile = () => {
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setSelectedFile(null);
        setFilePreviewUrl(null);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setAssignedTo([]);
        setDueDate("");
        handleRemoveFile();
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let uploadedFileObj = null;

            if (selectedFile) {
                uploadedFileObj = await uploadToCloudinary(selectedFile);
            }
            const fileUrl = uploadedFileObj?.secure_url || uploadedFileObj?.url || (typeof uploadedFileObj === 'string' ? uploadedFileObj : null);

            const payload = {
                workspaceId,
                title,
                description,
                status,
                assignedTo,
                dueDate,
                createdBy: currentUserId,
                attachments: fileUrl ? [fileUrl] : []
            };

            const res = await createTask(payload);

            if (res.success) {
                onTaskCreated(res.task);
                resetForm();
                onClose();
            } else {
                setError(res.error || "Failed to create task");
            }
        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#0b1329] border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative my-8">
                <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <span>➕</span> Create New Task
                    </h3>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-slate-400 hover:text-white text-lg font-bold"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Implement Authentication System"
                            className="w-full bg-[#060b19] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Status Select */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#060b19] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="IN_REVIEW">In Review</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add task details, requirements, or links..."
                            className="w-full bg-[#060b19] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                        ></textarea>
                    </div>

                    {/* File Attachment & Preview Link */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Attachment (Images, Videos, PDFs)
                        </label>
                        <input
                            type="file"
                            accept="image/*,video/*,.pdf"
                            onChange={handleFileChange}
                            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer bg-[#060b19] border border-slate-800 rounded-lg p-1"
                        />

                        {selectedFile && (
                            <div className="mt-3 bg-[#060b19] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">

                                    <File className="w-5 h-5 text-indigo-400 shrink-0" />

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]" title={selectedFile?.name}>
                                            {selectedFile?.name}
                                        </span>

                                        <a
                                            href={filePreviewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1 mt-0.5 w-fit"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Preview File</span>
                                            <Link className="w-2.5 h-2.5 text-indigo-400" />
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={loading}
                                    className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs px-2.5 py-1 rounded-lg transition-colors ml-2"
                                    title="Remove file"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Due Date *
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-[#060b19] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                        />
                    </div>

                    {/* Assign Members */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                            Assign Members
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#060b19] border border-slate-800 rounded-lg">
                            {members?.map((member) => {
                                const isSelected = assignedTo.includes(member.userId);
                                return (
                                    <button
                                        type="button"
                                        key={member.userId}
                                        onClick={() => toggleAssignee(member.userId)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${isSelected
                                            ? "bg-indigo-600/20 text-indigo-300 border-indigo-500"
                                            : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                        {member.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                "Create Task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}