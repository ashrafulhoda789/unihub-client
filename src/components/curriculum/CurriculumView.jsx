'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import CurriculumCard from './CurriculumCard';
import CurriculumModal from './CurriculumModal';
import Pagination from '@/components/common/Pagination';
import { getResources } from '@/lib/api/curriculum';
import { addCurriculumResource, updateResources, deleteResources } from '@/lib/action/curriculum';
import { BookCopy, Search, Filter } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const SEMESTERS = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const DEPARTMENTS = ['CSE', 'EEE', 'ECE', 'Civil'];

function CurriculumContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedDept = searchParams.get('department') || 'CSE';
    const selectedSemester = searchParams.get('semester') || 'All';
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

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    // URL Query Parameter Updating Helper
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

    // Sync input field when URL updates (e.g. Browser Back/Forward)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchInput(searchQuery);
    }, [searchQuery]);

    // Fetch Curriculum Data based on Email, Params & Page
    const loadResources = useCallback(async () => {
        if (!userEmail) return;
        setLoading(true);
        try {
            const res = await getResources(
                userEmail,
                selectedDept,
                selectedSemester,
                searchQuery,
                pageFromUrl,
                limit
            );

            if (res?.data) {
                setResources(res.data);
                setTotalPages(res.totalPages || Math.ceil((res.total || res.data.length) / limit) || 1);
            } else {
                setResources([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Failed to fetch curriculum data:", error);
            setResources([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [userEmail, selectedDept, selectedSemester, searchQuery, pageFromUrl, limit]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadResources();
    }, [loadResources]);

    // Page Navigation Handler
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
            const payload = {
                ...formData,
                uploadedBy: userEmail
            };

            if (selectedResource) {
                await updateResources(selectedResource._id, payload);
            } else {
                await addCurriculumResource(payload);
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

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this resource?")) {
            try {
                await deleteResources(id);
                loadResources();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d1527]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Curriculum Resources</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your uploaded course materials and study resources.</p>
                </div>
                <button
                    onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    + Add Curriculum
                </button>
            </div>

            {/* Filter & Search Bar */}
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

                    {/* Search Bar */}
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

                {/* Semester Filter Tabs */}
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

            {/* Resources List & Pagination */}
            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
                    Loading your resources...
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1527]/60 backdrop-blur-md rounded-2xl border border-dashed border-slate-800 p-8">
                    <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <BookCopy />
                    </div>
                    <p className="text-slate-300 font-semibold text-lg">No curriculum resources found.</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click + Add Curriculum to upload standard resources.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((item) => (
                            <CurriculumCard
                                key={item._id}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={pageFromUrl}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Modal */}
            <CurriculumModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedResource(null); }}
                onSubmit={handleFormSubmit}
                initialData={selectedResource}
                isSubmitting={submitting}
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