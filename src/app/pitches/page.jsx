'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Users, ArrowRight, Sparkles, Lock, Clock, CheckCircle2 } from 'lucide-react';
import { getAllPitches } from '@/lib/api/myPitch';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination';

const CATEGORIES = ["All", "DSA", "Web Dev", "Machine Learning", "Embedded Systems", "Cyber Security"];

const PitchesContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Param values
    const categoryFromUrl = searchParams.get('category') || 'All';
    const searchFromUrl = searchParams.get('search') || '';
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
    const limit = 9;

    const [pitches, setPitches] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchFromUrl);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

    // Helper: Update URL Parameters
    const updateUrlParams = useCallback((newCategory, newSearch, newPage = 1) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newCategory && newCategory !== 'All') {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }

        if (newSearch && newSearch.trim() !== '') {
            params.set('search', newSearch.trim());
        } else {
            params.delete('search');
        }

        if (newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    // Live Debounce Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== searchFromUrl) {
                updateUrlParams(selectedCategory, search, 1);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedCategory, searchFromUrl, updateUrlParams]);

    // Sync input states when URL changes directly (e.g. Back/Forward navigation)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCategory(categoryFromUrl);
        setSearch(searchFromUrl);
    }, [categoryFromUrl, searchFromUrl]);

    // Fetch API Data
    useEffect(() => {
        const fetchPitches = async () => {
            setLoading(true);
            try {
                const res = await getAllPitches({
                    category: categoryFromUrl,
                    search: searchFromUrl,
                    page: pageFromUrl,
                    limit: limit
                });

                if (res?.success) {
                    setPitches(res.data || []);
                    setTotalPages(res.totalPages || Math.ceil((res.total || res.data?.length || 0) / limit) || 1);
                } else {
                    setPitches([]);
                    setTotalPages(1);
                }
            } catch (err) {
                console.error("Failed to fetch pitches:", err);
                setPitches([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchPitches();
    }, [categoryFromUrl, searchFromUrl, pageFromUrl]);

    // Page Handler
    const handlePageChange = (newPage) => {
        updateUrlParams(selectedCategory, search, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        updateUrlParams(cat, search, 1);
    };

    const renderStatusBadge = (pitch) => {
        const isLocked = pitch.isFinalized;
        const isExpired = pitch.expiresAt && new Date(pitch.expiresAt) < new Date();

        if (isLocked) {
            return (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lock className="w-3 h-3" /> Locked
                </span>
            );
        }

        if (isExpired) {
            return (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Clock className="w-3 h-3" /> Expired
                </span>
            );
        }

        return (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Active
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Innovation Hub
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Explore Innovative <span className="text-indigo-500">Pitches</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg">
                        Discover academic projects, collaborate with peers, or find teams looking for your skills.
                    </p>
                </div>

                {/* Filter & Search */}
                <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-4 mb-10 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <form onSubmit={(e) => e.preventDefault()} className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by title, skill or topic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </form>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse p-6"></div>
                        ))}
                    </div>
                ) : pitches.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
                        <Filter className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-300">No pitches found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your filter or search criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pitches.map((pitch) => (
                                <div key={pitch._id} className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {pitch.category}
                                            </span>
                                            {renderStatusBadge(pitch)}
                                        </div>

                                        <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                                            {pitch.title}
                                        </h2>
                                        <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4">
                                            {pitch.description}
                                        </p>
                                        <div className="mb-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {pitch.requiredSkills?.slice(0, 4).map((skill, idx) => (
                                                    <span key={`${pitch._id}-${skill}-${idx}`} className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5 text-slate-500" /> {pitch.members?.length || 1} Member(s)
                                        </span>
                                        {pitch.expiresAt && new Date(pitch.expiresAt) < new Date() ? (
                                            <button disabled className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-not-allowed opacity-60">
                                                Expired <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <Link href={`/pitches/${pitch._id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                                                View Details <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reusable Pagination */}
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
};

// Main Export Wrapped with Suspense boundary
const PitchesPage = () => (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <PitchesContent />
    </Suspense>
);

export default PitchesPage;