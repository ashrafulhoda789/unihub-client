'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, FileText, ExternalLink, BookOpen, Clock, Building,
    GraduationCap, Download, Share2, Eye, UserCheck, CheckCircle2,
    FileCheck, Bookmark, HelpCircle, Layers
} from 'lucide-react';
import { getSingleCurriculum } from '@/lib/api/curriculum';

export default function CourseDetailPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                const res = await getSingleCurriculum(id);
                if (res?.data) {
                    setCourse(res.data);
                }
            } catch (error) {
                console.error("Failed to load course details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCourseDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070c18] text-slate-400 flex items-center justify-center font-medium animate-pulse">
                Loading curriculum details...
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Resource Not Found</h2>
                <p className="text-slate-400 text-sm mb-6">The curriculum resource you are looking for does not exist or has been removed.</p>
                <Link href="/curriculum" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
                    Back to Curriculum
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070c18] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Navigation Bar */}
                <div className="flex justify-between items-center">
                    <Link
                        href="/resources"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft size={16} /> Back to Resources
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors" title="Bookmark">
                            <Bookmark size={18} />
                        </button>
                        <button className="p-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors" title="Share">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Grid: Left Content (2 cols) & Right Sidebar (1 col) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Core Curriculum Information */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Banner */}
                        <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full uppercase tracking-wider">
                                    {course.documentType || 'Slide'}
                                </span>
                                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full uppercase">
                                    {course.semester} Semester
                                </span>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <UserCheck size={12} /> Verified Material
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                {course.title}
                            </h1>

                            <div className="flex items-center gap-3 pt-2 text-indigo-400 font-medium text-sm">
                                <span>{course.courseName}</span>
                                <span className="text-slate-600">•</span>
                                <span className="bg-slate-800/80 px-2.5 py-0.5 rounded text-slate-300 font-mono text-xs">{course.courseId}</span>
                            </div>
                        </div>

                        {/* Description & Learning Topics */}
                        <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <BookOpen size={16} className="text-indigo-400" /> Resource Overview
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
                                    {course.description || "This resource contains comprehensive slides and notes covering core topics, implementation guidelines, and structural diagrams."}
                                </p>
                            </div>

                            {/* Core Topics Covered Checklist */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <CheckCircle2 size={16} className="text-indigo-400" /> Key Topics & Modules
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {['Dynamic Resizing Logic', 'Amortized Time Complexity Analysis', 'Memory Allocation in Heap', 'Array Vs Dynamic Array Comparison'].map((topic, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 text-slate-300">
                                            <FileCheck size={14} className="text-emerald-400 flex-shrink-0" />
                                            <span>{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Document Preview Section */}
                        {course.fileUrl && (
                            <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Eye size={16} className="text-indigo-400" /> Document Viewer
                                    </h3>
                                    <a
                                        href={course.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                                    >
                                        Open Fullscreen <ExternalLink size={12} />
                                    </a>
                                </div>

                                <div className="w-full h-96 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                                    {course.fileUrl.endsWith('.pdf') ? (
                                        <iframe src={course.fileUrl} className="w-full h-full" title="PDF Preview"></iframe>
                                    ) : (
                                        <div className="text-center p-6 space-y-3">
                                            <FileText size={48} className="mx-auto text-indigo-400/80" />
                                            <p className="text-sm text-slate-300 font-medium">Inline preview is optimized for PDF documents.</p>
                                            <a
                                                href={course.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                                            >
                                                <Download size={14} /> Download File to View
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Metadata Sidebar & Actions */}
                    <div className="space-y-6">

                        {/* Download & Actions Box */}
                        <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Material</h3>

                            {course.fileUrl ? (
                                <a
                                    href={course.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                                >
                                    <Download size={18} /> Download Attachment
                                </a>
                            ) : (
                                <button disabled className="w-full py-3.5 bg-slate-800 text-slate-500 text-sm font-semibold rounded-xl cursor-not-allowed">
                                    No File Attached
                                </button>
                            )}

                            {course.resourceLink && (
                                <a
                                    href={course.resourceLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-sm font-semibold rounded-xl transition-all"
                                >
                                    <ExternalLink size={16} /> Open Reference Link
                                </a>
                            )}
                        </div>

                        {/* Resource Metadata Info Card */}
                        <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                                Metadata Specifications
                            </h3>

                            <div className="space-y-3.5 text-xs">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Building size={14} /> Department</span>
                                    <span className="font-semibold text-white">{course.department}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-500 flex items-center gap-1.5"><GraduationCap size={14} /> Semester</span>
                                    <span className="font-semibold text-white">{course.semester} Semester</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Layers size={14} /> File Format</span>
                                    <span className="font-semibold text-indigo-400 uppercase">{course.documentType || 'PDF'}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Clock size={14} /> Last Updated</span>
                                    <span className="font-semibold text-white">
                                        {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Faculty / Author Info Card */}
                        <div className="bg-[#0d1527]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Provided By</h3>
                            <div className="flex items-center gap-3 pt-1">
                                <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center font-bold text-sm">
                                    {course.uploadedBy ? course.uploadedBy.charAt(0).toUpperCase() : 'F'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{course.uploadedBy ? course.uploadedBy.split('@')[0] : 'Faculty Member'}</p>
                                    <p className="text-xs text-slate-400">{course.uploadedBy || 'Academic Faculty'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Help Card */}
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-5 space-y-2 text-xs text-slate-400">
                            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <HelpCircle size={14} className="text-indigo-400" /> Need Help?
                            </p>
                            <p className="leading-relaxed">
                                If this material contains broken links or incorrect information, please report it to your department coordinator.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}