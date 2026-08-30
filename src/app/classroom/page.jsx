'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    FileText,
    Download,
    ArrowLeft,
    Layers,
    GraduationCap,
    Folder,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

// Mock Data Structure for Courses & Resources
const DEPARTMENTS = ['CSE', 'EEE', 'ECE', 'Civil'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const MOCK_COURSES = [
    { id: 'CSE-301', title: 'Database Management Systems', code: 'CSE-301', department: 'CSE', semester: '6th' },
    { id: 'CSE-303', title: 'Compiler Design', code: 'CSE-303', department: 'CSE', semester: '6th' },
    { id: 'CSE-305', title: 'Software Engineering', code: 'CSE-305', department: 'CSE', semester: '6th' },
    { id: 'EEE-201', title: 'Electronic Circuits', code: 'EEE-201', department: 'EEE', semester: '3rd' },
];

const MOCK_RESOURCES = {
    'outline': [
        { id: '1', title: 'Course Syllabus & Marks Distribution', fileType: 'PDF', size: '1.2 MB', date: 'Jan 2026', link: '#' },
        { id: '2', title: 'Recommended Textbooks & Reference Links', fileType: 'DOCX', size: '450 KB', date: 'Jan 2026', link: '#' },
    ],
    'mid': [
        { id: '3', title: 'Midterm Question Bank (2022-2025)', fileType: 'ZIP', size: '14.5 MB', date: 'Feb 2026', link: '#' },
        { id: '4', title: 'Midterm Short Lecture Notes (Modules 1-3)', fileType: 'PDF', size: '3.8 MB', date: 'Feb 2026', link: '#' },
    ],
    'final': [
        { id: '5', title: 'Final Exam Sample Questions with Solutions', fileType: 'PDF', size: '5.2 MB', date: 'May 2026', link: '#' },
        { id: '6', title: 'Complete Term Slide Deck & Review', fileType: 'PDF', size: '22.1 MB', date: 'May 2026', link: '#' },
    ]
};

export default function ClassroomPage() {
    const [selectedDept, setSelectedDept] = useState('CSE');
    const [selectedSemester, setSelectedSemester] = useState('6th');
    const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0]);
    const [activeTab, setActiveTab] = useState('mid'); // 'outline' | 'mid' | 'final'

    // Filter courses based on selected Department & Semester
    const filteredCourses = MOCK_COURSES.filter(
        c => c.department === selectedDept && c.semester === selectedSemester
    );

    // Auto-select first available course when filters change
    useEffect(() => {
        if (filteredCourses.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedCourse(filteredCourses[0]);
        } else {
            setSelectedCourse(null);
        }
    }, [selectedDept, selectedSemester]);

    return (
        <div className="min-h-screen bg-[#070c18] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Navigation & Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <Link
                            href="/curriculum"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition mb-2"
                        >
                            <ArrowLeft size={14} /> Back to Public Curriculum
                        </Link>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <GraduationCap className="text-indigo-500" size={36} /> Academic Classroom
                        </h1>
                    </div>

                    {/* Department & Semester Quick Selectors */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                        >
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept} Department</option>
                            ))}
                        </select>

                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                        >
                            {SEMESTERS.map(sem => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Classroom Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar: Course List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#0d1527]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-400" />
                                Courses ({selectedDept} - {selectedSemester} Sem)
                            </h2>

                            {filteredCourses.length === 0 ? (
                                <p className="text-xs text-slate-500 py-6 text-center">No courses listed for this semester.</p>
                            ) : (
                                <div className="space-y-2">
                                    {filteredCourses.map((course) => {
                                        const isSelected = selectedCourse?.id === course.id;
                                        return (
                                            <button
                                                key={course.id}
                                                onClick={() => setSelectedCourse(course)}
                                                className={`w-full text-left p-3.5 rounded-xl border transition-all ${isSelected
                                                        ? 'bg-indigo-600/10 border-indigo-500/50 text-white shadow-md'
                                                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-indigo-500/20">
                                                        {course.code}
                                                    </span>
                                                    {isSelected && <CheckCircle2 size={14} className="text-indigo-400" />}
                                                </div>
                                                <p className="text-sm font-semibold line-clamp-1">{course.title}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Course Details & Materials */}
                    <div className="lg:col-span-8 space-y-6">
                        {selectedCourse ? (
                            <div className="bg-[#0d1527]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">

                                {/* Selected Course Title Header */}
                                <div className="border-b border-slate-800/80 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                            {selectedCourse.code}
                                        </span>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                                            {selectedCourse.title}
                                        </h2>
                                    </div>

                                    {/* Resource Segment Tabs (Outline, Mid, Final) */}
                                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
                                        {[
                                            { id: 'outline', label: 'Outline' },
                                            { id: 'mid', label: 'Midterm' },
                                            { id: 'final', label: 'Final' }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.id
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Resource Material List */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Folder size={16} className="text-indigo-400" />
                                        {activeTab.toUpperCase()} Materials & Downloads
                                    </h3>

                                    {MOCK_RESOURCES[activeTab]?.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                                            <p className="text-xs text-slate-500">No resources published yet for this tab.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {MOCK_RESOURCES[activeTab]?.map((resource) => (
                                                <div
                                                    key={resource.id}
                                                    className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 rounded-xl p-4 flex items-center justify-between gap-4 transition"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="text-sm font-semibold text-white truncate">{resource.title}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {resource.fileType} • {resource.size} • Uploaded {resource.date}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={resource.link}
                                                        className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-medium"
                                                        title="Download Resource"
                                                    >
                                                        <Download size={16} />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div className="bg-[#0d1527]/40 border border-dashed border-slate-800 rounded-2xl py-20 text-center">
                                <Layers size={40} className="mx-auto text-slate-600 mb-2" />
                                <p className="text-slate-400 font-medium text-sm">Please select a course to view details.</p>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}