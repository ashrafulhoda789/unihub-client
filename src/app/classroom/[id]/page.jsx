'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    FileText,
    BookOpen,
    Eye,
    X,
    Layers,
    User,
    Calendar
} from 'lucide-react';
import { getSingleClassroomResource } from '@/lib/api/classroom';

export default function ClassroomResourceDetail({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        const fetchResourceDetail = async () => {
            setLoading(true);
            try {
                const res = await getSingleClassroomResource(id);
                const data = res?.data || res;
                if (data) {
                    setResource(data);
                } else {
                    setError('Resource not found.');
                }
            } catch (err) {
                console.error("Failed to fetch resource detail:", err);
                setError('Failed to load resource details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResourceDetail();
        }
    }, [id]);

    const getFilesList = () => {
        if (!resource) return [];

        if (Array.isArray(resource.resources) && resource.resources.length > 0) {
            return resource.resources.map((file, idx) => ({
                name: file.name || file.title || `${resource.title} - File ${idx + 1}`,
                url: file.url || file.fileUrl || file.link,
                size: file.size || 'Standard',
                type: file.type || resource.documentType || 'PDF'
            }));
        }

        const singleUrl = resource.fileUrl || resource.link;
        if (singleUrl) {
            return [{
                name: resource.fileName || resource.title || 'Document File',
                url: singleUrl,
                size: resource.size || 'Standard',
                type: resource.documentType || 'PDF'
            }];
        }

        return [];
    };

    const files = getFilesList();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070c18] flex items-center justify-center text-indigo-400 animate-pulse font-medium">
                Loading resource details...
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col items-center justify-center p-6">
                <div className="bg-[#0d1527] border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full shadow-xl">
                    <p className="text-red-400 font-semibold mb-4">{error || 'Resource not found.'}</p>
                    <Link
                        href="/classroom"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
                    >
                        <ArrowLeft size={14} /> Back to Classroom
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070c18] text-slate-100 py-6 px-3 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Navigation Back */}
                <Link
                    href="/classroom"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition"
                >
                    <ArrowLeft size={14} /> Back to Classroom
                </Link>

                {/* Main Content Card */}
                <div className="bg-[#0d1527] backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-8 space-y-6">

                    {/* Header Badges */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 uppercase tracking-wider">
                                {resource.department || 'CSE'}
                            </span>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                                {resource.semester ? `${resource.semester} Semester` : 'General'}
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-indigo-400/80 uppercase tracking-widest bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-900/50">
                            {resource.classroomCategory || resource.category || resource.documentType || 'Resource'}
                        </span>
                    </div>

                    {/* Title & Course Info */}
                    <div className="space-y-2">
                        <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {resource.title}
                        </h1>
                        {resource.courseName && (
                            <p className="text-xs sm:text-sm font-semibold text-indigo-400 flex items-center gap-1.5">
                                <BookOpen size={16} /> {resource.courseName} {resource.courseId ? `(${resource.courseId})` : ''}
                            </p>
                        )}
                    </div>

                    {/* Description Section */}
                    {resource.description && (
                        <div className="border-t border-slate-800/80 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {resource.description}
                            </p>
                        </div>
                    )}

                    {/* Additional Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-slate-800/80 py-4 text-xs">
                        <div>
                            <span className="text-slate-500 block mb-1">Uploaded By</span>
                            <span className="font-semibold text-slate-200 flex items-center gap-1 truncate">
                                <User size={12} className="text-indigo-400 shrink-0" /> {resource.uploadedBy || 'Admin'}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">Total Files</span>
                            <span className="font-semibold text-slate-200">{files.length} Attachment(s)</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">Uploaded On</span>
                            <span className="font-semibold text-slate-200 flex items-center gap-1">
                                <Calendar size={12} className="text-indigo-400 shrink-0" />
                                {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                        </div>
                    </div>

                    {/* Attached Files List - Optimized for Small Devices */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Layers size={14} className="text-indigo-400" /> Attached Documents ({files.length})
                        </h3>

                        {files.length === 0 ? (
                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                                No specific file attachments found in this record.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {files.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                                    >
                                        {/* File Info */}
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition">
                                                    {file.name}
                                                </p>
                                                <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase">
                                                    {file.type} • {file.size}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons (Stacked on mobile, row on desktop) */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/60">
                                            <button
                                                onClick={() => setPreviewFile(file)}
                                                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
                                            >
                                                <Eye size={14} /> Preview
                                            </button>
                                            {file.url && (
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                                                >
                                                    <Download size={14} /> Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Interactive Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
                    <div className="bg-[#0d1527] border border-slate-800 w-full max-w-4xl h-[90vh] sm:h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="text-indigo-400 shrink-0" size={16} />
                                <h3 className="text-xs sm:text-sm font-bold text-white truncate">{previewFile.name}</h3>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                {previewFile.url && (
                                    <a
                                        href={previewFile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-[11px] sm:text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center gap-1"
                                    >
                                        <Download size={13} /> <span className="hidden xs:inline">Download</span>
                                    </a>
                                )}
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body / Iframe */}
                        <div className="flex-1 bg-slate-950/55 relative flex items-center justify-center">
                            {previewFile.url ? (
                                <iframe
                                    src={previewFile.url}
                                    title={previewFile.name}
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <div className="text-slate-400 text-xs">Preview link not available for this file.</div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}