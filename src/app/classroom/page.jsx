/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, GraduationCap, Folder, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPublicClassroomResources } from '@/lib/api/classroom';
import Pagination from '@/components/common/Pagination';

const DEPARTMENTS = ['CSE', 'EEE', 'ECE', 'Civil'];
const SEMESTERS = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const CATEGORIES = [
    { id: 'mid', label: 'Midterm' },
    { id: 'final', label: 'Final' },
    { id: 'book', label: 'Books & Notes' }
];

function ClassroomContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Query Params tracking
    const selectedDept = searchParams.get('department') || 'CSE';
    const selectedSemester = searchParams.get('semester') || 'All';
    const classroomCategory = searchParams.get('category') || 'mid';
    const searchQuery = searchParams.get('q') || '';
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
    const limit = 6;

    const [resources, setResources] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchQuery);

    // URL Param Updater Helper
    const updateQueryParams = useCallback((key, value, resetPage = false) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'All' && value.trim() !== '') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        if (resetPage) {
            params.delete('page');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    // Search Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchQuery) {
                updateQueryParams('q', searchInput, true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, searchQuery, updateQueryParams]);

    // Sync input when URL changes back/forth
    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    // Fetch API Data using `getPublicClassroomResources`
    useEffect(() => {
        let isMounted = true;

        const fetchClassroomData = async () => {
            setLoading(true);
            try {
                const res = await getPublicClassroomResources(
                    selectedDept,
                    selectedSemester,
                    classroomCategory,
                    searchQuery,
                    pageFromUrl,
                    limit
                );

                if (!isMounted) return;

                if (res?.data) {
                    setResources(res.data);
                    setTotalPages(res.totalPages || Math.ceil((res.total || res.data.length) / limit) || 1);
                } else if (Array.isArray(res)) {
                    setResources(res);
                    setTotalPages(1);
                } else {
                    setResources([]);
                    setTotalPages(1);
                }
            } catch (error) {
                if (!isMounted) return;
                console.error("Failed to load classroom resources:", error);
                setResources([]);
                setTotalPages(1);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchClassroomData();

        return () => {
            isMounted = false;
        };
    }, [selectedDept, selectedSemester, classroomCategory, searchQuery, pageFromUrl]);

    // Pagination Handler
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#070c18] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Back Link */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <Link
                            href="/resources"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition mb-2"
                        >
                            <ArrowLeft size={14} /> Back to Public Curriculum
                        </Link>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <GraduationCap className="text-indigo-500" size={36} /> Academic Classroom
                        </h1>
                    </div>

                    {/* Department Quick Filter */}
                    <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
                        <Filter size={16} className="text-indigo-400 ml-2" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Dept:</span>
                        <div className="flex gap-1">
                            {DEPARTMENTS.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => updateQueryParams('department', dept, true)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${selectedDept === dept
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Control Panel: Search, Category Tabs & Semester Selectors */}
                <div className="bg-[#0d1527]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Category Segment Tabs */}
                        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateQueryParams('category', cat.id, true)}
                                    className={`flex-1 md:flex-initial px-5 py-2 text-xs font-semibold rounded-lg transition-all ${classroomCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search materials, course name..."
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
                                    onClick={() => updateQueryParams('semester', sem, true)}
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

                {/* Resource Grid Listing */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse font-medium">
                        Loading classroom resources...
                    </div>
                ) : resources.length === 0 ? (
                    <div className="text-center py-20 bg-[#0d1527]/40 rounded-2xl border border-dashed border-slate-800 p-8">
                        <Folder size={40} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-slate-300 font-semibold text-lg">No resources available.</p>
                        <p className="text-xs text-slate-500 mt-1">Try changing your filters or searching for something else.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((item, index) => {
                                const resourceId = item._id || item.id;
                                const cardContent = (
                                    <div className="bg-[#0b101d] hover:bg-[#0e1424] backdrop-blur-md rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all p-6 flex flex-col justify-between shadow-xl group cursor-pointer">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                                                    {item.semester || selectedSemester} Semester
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                                    {item.documentType || 'PDF'}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                                                {item.title}
                                            </h3>

                                            {item.courseName && (
                                                <p className="text-xs font-semibold text-indigo-400/90 mb-3">
                                                    {item.courseName} {item.courseId ? `• ${item.courseId}` : ''}
                                                </p>
                                            )}

                                            {item.description && (
                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                                            <span>View full details</span>
                                            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform text-slate-500 group-hover:text-indigo-400" />
                                        </div>
                                    </div>
                                );

                                return resourceId ? (
                                    <Link key={resourceId} href={`/classroom/${resourceId}`} className="block">
                                        {cardContent}
                                    </Link>
                                ) : (
                                    <div key={item.title || index}>
                                        {cardContent}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reusable Pagination Component */}
                        <Pagination
                            currentPage={pageFromUrl}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}

            </div>
        </div>
    );
}

export default function ClassroomPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#070c18]" />}>
            <ClassroomContent />
        </Suspense>
    );
}