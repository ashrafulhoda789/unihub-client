/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import CurriculumCard from './CurriculumCard';
import ClassroomCard from './ClassroomCard';
import CurriculumModal from './CurriculumModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Pagination from '@/components/common/Pagination';
import { addCurriculumResource, updateResources, deleteResources } from '@/lib/action/curriculum';
import { getClassroomResources } from '@/lib/api/classroom';
import {
    addClassroomResource,
    updateClassroomResource,
    deleteClassroomResource
} from '@/lib/action/classroom';
import { BookCopy, Search, Filter, GraduationCap, LayoutGrid } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getResources } from '@/lib/api/curriculum';

const SEMESTERS = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const DEPARTMENTS = ['CSE', 'EEE', 'ECE', 'Civil'];
const CLASSROOM_CATEGORIES = [
    { id: 'All', label: 'All Categories' },
    { id: 'book', label: 'Book' },
    { id: 'mid', label: 'Midterm Exam' },
    { id: 'final', label: 'Final Exam' }
];

function CurriculumContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeTab = searchParams.get('tab') || 'curriculum';
    const selectedDept = searchParams.get('department') || 'CSE';
    const selectedSemester = searchParams.get('semester') || 'All';
    const selectedCategory = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('q') || '';
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
    const limit = 9;

    const [resources, setResources] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchQuery);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchQuery) {
                updateQueryParams('q', searchInput, true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, searchQuery, updateQueryParams]);

    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    const loadResources = useCallback(async () => {
        if (!userEmail) return;
        setLoading(true);
        try {
            let res;
            if (activeTab === 'classroom') {
                res = await getClassroomResources(
                    userEmail,
                    selectedDept,
                    selectedSemester,
                    selectedCategory,
                    searchQuery,
                    pageFromUrl,
                    limit
                );
            } else {
                res = await getResources(
                    userEmail,
                    selectedDept,
                    selectedSemester,
                    searchQuery,
                    pageFromUrl,
                    limit
                );
            }

            if (res?.data) {
                setResources(res.data);
                setTotalPages(res.totalPages || Math.ceil((res.total || res.data.length) / limit) || 1);
            } else {
                setResources([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Failed to fetch resources:", error);
            setResources([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [userEmail, activeTab, selectedDept, selectedSemester, selectedCategory, searchQuery, pageFromUrl, limit]);

    useEffect(() => {
        loadResources();
    }, [loadResources]);

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

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
            const payload = { ...formData, uploadedBy: userEmail };
            const isClassroom = formData.targetType === 'classroom' || activeTab === 'classroom';

            if (isClassroom) {
                if (selectedResource) {
                    await updateClassroomResource(selectedResource._id, payload);
                } else {
                    await addClassroomResource(payload);
                }
            } else {
                if (selectedResource) {
                    await updateResources(selectedResource._id, payload);
                } else {
                    await addCurriculumResource(payload);
                }
            }

            setIsModalOpen(false);
            setSelectedResource(null);
            loadResources();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const handleDelete = (id, title) => {
        setItemToDelete({ id, title });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        try {
            if (activeTab === 'classroom') {
                await deleteClassroomResource(itemToDelete.id);
            } else {
                await deleteResources(itemToDelete.id);
            }
            loadResources();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 text-slate-100 box-border overflow-x-hidden">
            {/* Header */}
            <div className="w-full bg-[#0d1527]/85 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl box-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                            Academic Resources
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                            Manage curriculum materials and classroom exam resources in one place.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedResource(null);
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto shrink-0 px-4 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-center"
                    >
                        + Add New Resource
                    </button>
                </div>
            </div>

            {/* TAB SWITCHER - Modern Pill Design */}
            <div className="w-full bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md flex gap-2">
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('tab', 'curriculum');
                        params.delete('category');
                        params.delete('page');
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all ${activeTab === 'curriculum'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                >
                    <BookCopy size={16} />
                    <span>Curriculum</span>
                </button>
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('tab', 'classroom');
                        params.delete('page');
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all ${activeTab === 'classroom'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                >
                    <GraduationCap size={16} />
                    <span>Classroom</span>
                </button>
            </div>

            {/* Filter and Search Container */}
            <div className="w-full bg-[#0d1527]/85 backdrop-blur-md p-3 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 box-border">
                {/* Department + Search */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 w-full">
                    {/* Department Filter */}
                    <div className="w-full lg:w-auto flex items-center gap-2 min-w-0">
                        <div className="flex items-center gap-2 shrink-0 text-slate-400">
                            <Filter size={16} className="text-indigo-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                                Dept:
                            </span>
                        </div>
                        <div className="w-full lg:w-auto overflow-x-auto scrollbar-none">
                            <div className="inline-flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 min-w-max">
                                {DEPARTMENTS.map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => updateQueryParams('department', dept, true)}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${selectedDept === dept
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

                    {/* Search Input Box */}
                    <div className="relative w-full lg:w-80 shrink-0">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            size={18}
                        />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search course code, name or title..."
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all shadow-inner box-border"
                        />
                    </div>
                </div>

                {/* classroom category */}
                {activeTab === 'classroom' && (
                    <div className="border-t border-slate-800/80 pt-4 w-full box-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-2 text-slate-400">
                                <LayoutGrid size={16} className="text-indigo-400" />
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Category:
                                </span>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => updateQueryParams('category', e.target.value, true)}
                                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none cursor-pointer box-border"
                                >
                                    {CLASSROOM_CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom Dropdown Arrow Icon */}
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-slate-800/80 pt-4 w-full box-border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Filter by Semester
                        </span>
                        <div className="relative w-full sm:w-64">
                            <select
                                value={selectedSemester}
                                onChange={(e) => updateQueryParams('semester', e.target.value, true)}
                                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none cursor-pointer box-border"
                            >
                                {SEMESTERS.map((sem) => (
                                    <option key={sem} value={sem} className="bg-slate-900 text-white">
                                        {sem === 'All' ? 'All Semesters' : `${sem} Semester`}
                                    </option>
                                ))}
                            </select>
                            {/* Custom Arrow Icon for Dropdown */}
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>

            {/* List and Pagination */}
            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse text-sm">
                    Loading your resources...
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1527]/60 backdrop-blur-md rounded-2xl border border-dashed border-slate-800 p-6 sm:p-8">
                    <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <BookCopy />
                    </div>
                    <p className="text-slate-300 font-semibold text-base sm:text-lg">No {activeTab} resources found.</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click + Add New Resource to upload.</p>
                </div>
            ) : (
                <div className="space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                        {resources.map((item) =>
                            activeTab === 'classroom' ? (
                                <ClassroomCard
                                    key={item._id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <CurriculumCard
                                    key={item._id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )
                        )}
                    </div>

                    <Pagination
                        currentPage={pageFromUrl}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Shared Modal */}
            <CurriculumModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedResource(null); }}
                onSubmit={handleFormSubmit}
                initialData={selectedResource ? { ...selectedResource, targetType: activeTab } : null}
                isSubmitting={submitting}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={itemToDelete?.title}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default function CurriculumView() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-400 text-sm">Loading curriculum view...</div>}>
            <CurriculumContent />
        </Suspense>
    );
}