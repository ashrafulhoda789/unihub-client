'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Layers, Filter, FileCode } from 'lucide-react';
import { getPublicCurriculum } from '@/lib/api/curriculum';
import Link from 'next/link';

const SEMESTERS = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const DEPARTMENTS = ['CSE', 'EEE', 'ECE', 'Civil'];

export default function LandingCurriculumPage() {
    const [selectedDept, setSelectedDept] = useState('CSE');
    const [selectedSemester, setSelectedSemester] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCourse, setActiveCourse] = useState(null);

    // Fetch Data on Filter Change
    useEffect(() => {
        const fetchCurriculum = async () => {
            setLoading(true);
            try {
                const res = await getPublicCurriculum(selectedDept, selectedSemester);
                if (res?.data) {
                    setResources(res.data);
                }
            } catch (error) {
                console.error("Failed to load curriculum:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurriculum();
    }, [selectedDept, selectedSemester]);

    // Client-side Search Filter
    const filteredResources = useMemo(() => {
        return resources.filter(item => {
            const query = searchQuery.toLowerCase();
            return (
                item.title?.toLowerCase().includes(query) ||
                item.courseName?.toLowerCase().includes(query) ||
                item.courseId?.toLowerCase().includes(query)
            );
        });
    }, [resources, searchQuery]);

    return (
        <div className="min-h-screen bg-[#070c18] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Academic Structure
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Explore Our Curriculum
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400">
                        Browse course modules, lecture slides, syllabus guidelines, and academic reference materials across all semesters.
                    </p>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-[#0d1527]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Department Selector */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter size={18} className="text-indigo-400 hidden sm:block" />
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">Dept:</span>
                            <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
                                {DEPARTMENTS.map(dept => (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${selectedDept === dept
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                            }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search course code, name or title..."
                                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Semester Navigation Tabs */}
                    <div className="border-t border-slate-800/80 pt-4">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {SEMESTERS.map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => setSelectedSemester(sem)}
                                    className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${selectedSemester === sem
                                        ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30 font-semibold'
                                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                                        }`}
                                >
                                    {sem === 'All' ? 'All Semesters' : `${sem} Semester`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse font-medium">
                        Fetching curriculum structure...
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center py-20 bg-[#0d1527]/40 rounded-2xl border border-dashed border-slate-800 p-8">
                        <BookOpen size={40} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-slate-300 font-semibold text-lg">No curriculum materials found.</p>
                        <p className="text-xs text-slate-500 mt-1">Try selecting a different department or semester filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((item) => (
                            <Link
                                key={item._id}
                                href={`/resources/${item._id}`}
                                className="bg-[#0d1527]/80 hover:bg-[#0d1527] backdrop-blur-md rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all p-6 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-indigo-500/5"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                                            {item.semester} Semester
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium uppercase">
                                            {item.documentType || 'PDF'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-indigo-400/90 mt-1 mb-3">
                                        {item.courseName} • <span className="text-slate-400">{item.courseId}</span>
                                    </p>

                                    {item.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">View full details</span>
                                    <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}