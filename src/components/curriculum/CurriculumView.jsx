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

    // URL State Params
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

    // Helper: Update URL Search Params
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

    // Live Debounce for Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchQuery) {
                updateQueryParams('q', searchInput, true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, searchQuery, updateQueryParams]);

    // Sync search input on URL parameter change
    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    // Dynamic API Data Fetching Logic
    const loadResources = useCallback(async () => {
        if (!userEmail) return;
        setLoading(true);
        try {
            let res;

            if (activeTab === 'classroom') {
                // Fetch Classroom Resources
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
                // Fetch Curriculum Resources
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

    // Handle Page Navigation
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

    // Dynamic Create / Update Action Submission
    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                uploadedBy: userEmail
            };

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
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d1527]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Academic Resources</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage curriculum materials and classroom exam resources in one place.</p>
                </div>
                <button
                    onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    + Add New Resource
                </button>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex border-b border-slate-800 gap-4">
                <button
                    onClick={() => updateQueryParams('tab', 'curriculum', true)}
                    className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'curriculum'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <BookCopy size={18} />
                    Curriculum Resources
                </button>

                <button
                    onClick={() => updateQueryParams('tab', 'classroom', true)}
                    className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'classroom'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <GraduationCap size={18} />
                    Classroom Resources
                </button>
            </div>

            {/* Filter & Search Controls */}
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
                                    onClick={() => updateQueryParams('department', dept, true)}
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

                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search course code, name or title..."
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* CLASSROOM SPECIFIC CATEGORY FILTER */}
                {activeTab === 'classroom' && (
                    <div className="border-t border-slate-800/80 pt-4 flex items-center gap-2">
                        <LayoutGrid size={16} className="text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category:</span>
                        <div className="flex gap-2 overflow-x-auto">
                            {CLASSROOM_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateQueryParams('category', cat.id, true)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedCategory === cat.id
                                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                                        : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Semester Selector Tabs */}
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

            {/* List and Pagination */}
            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
                    Loading your resources...
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1527]/60 backdrop-blur-md rounded-2xl border border-dashed border-slate-800 p-8">
                    <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <BookCopy />
                    </div>
                    <p className="text-slate-300 font-semibold text-lg">No {activeTab} resources found.</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click + Add New Resource to upload.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </>
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
        <Suspense fallback={<div className="p-6 text-slate-400">Loading curriculum view...</div>}>
            <CurriculumContent />
        </Suspense>
    );
}