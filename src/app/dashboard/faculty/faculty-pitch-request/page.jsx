/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Trash2, AlertTriangle, ExternalLink, Loader2, Clock, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { deletePitchRequest } from '@/lib/action/joinRequest';
import { getUserJoinRequests } from '@/lib/api/joinRequest';
import { useSession } from '@/lib/auth-client';
import Pagination from '@/components/common/Pagination';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'];

function MyPitchRequestsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Query Params
    const searchQuery = searchParams.get('q') || '';
    const selectedStatus = searchParams.get('status') || 'ALL';
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
    const limit = 9;

    const [requests, setRequests] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState(searchQuery);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id || "";

    // URL Query Parameter Helper
    const updateQueryParams = useCallback((key, value, resetPage = false) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'ALL' && value.trim() !== '') {
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

    // Sync input field when URL updates (Back/Forward navigation)
    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    // Fetch Requests with Filters & Pagination
    const fetchRequests = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const res = await getUserJoinRequests(userId, {
                q: searchQuery,
                status: selectedStatus,
                page: pageFromUrl,
                limit
            });

            if (res?.success) {
                setRequests(res.data || []);
                setTotalPages(res.totalPages || Math.ceil((res.total || res.data?.length || 0) / limit) || 1);
            } else {
                setError(res?.error || "Failed to fetch pitch requests");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [userId, searchQuery, selectedStatus, pageFromUrl, limit]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Page Change Handler
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

    const handleOpenDeleteModal = (reqItem) => {
        setSelectedRequest(reqItem);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRequest) return;
        try {
            setIsDeleting(true);
            const res = await deletePitchRequest(selectedRequest.pitchId, selectedRequest.requestId);
            if (res?.success) {
                setRequests((prev) => prev.filter((item) => item.requestId !== selectedRequest.requestId));
                handleCloseModal();
                fetchRequests();
            }
        } catch (err) {
            console.error("Error deleting request:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Accepted
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle size={14} /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={14} /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Section */}
            <div className="border-b border-slate-800/80 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Pitch Requests</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Manage and track all join requests you submitted to team pitches.
                </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-[#0d1527]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={18} className="text-indigo-400 hidden sm:block" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">Status:</span>
                        <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
                            {STATUS_OPTIONS.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateQueryParams('status', status, true)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedStatus === status
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search pitch, role or message..."
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content Display */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
                    <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
                    <p className="text-sm">Fetching your requests...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center max-w-xl mx-auto my-8">
                    <p className="mb-3">{error}</p>
                    <button onClick={fetchRequests} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition">
                        Retry
                    </button>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <p className="text-gray-400 text-base mb-4">No pitch join requests found matching your filters.</p>
                    <Link
                        href="/pitches"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition"
                    >
                        Browse Pitches <ExternalLink size={16} />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((item) => (
                            <div
                                key={item.requestId}
                                className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg hover:shadow-indigo-500/5"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-md uppercase tracking-wider">
                                            {item.category || "General"}
                                        </span>
                                        {renderStatusBadge(item.status)}
                                    </div>

                                    <Link
                                        href={`/pitches/${item.pitchId}`}
                                        className="group flex items-center justify-between text-lg font-semibold text-white hover:text-indigo-400 transition mb-2"
                                    >
                                        <span className="line-clamp-1">{item.pitchTitle}</span>
                                        <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition text-indigo-400" />
                                    </Link>

                                    <div className="text-sm text-gray-300 mb-3">
                                        <span className="text-gray-500">Requested Role:</span>{' '}
                                        <span className="font-medium text-indigo-300">{item.role || "Developer"}</span>
                                    </div>

                                    <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800/60 mb-4">
                                        <p className="text-xs text-gray-500 mb-1 font-medium font-sans">Message:</p>
                                        <p className="text-xs text-gray-300 line-clamp-3 italic">
                                            {item.message || "No message provided."}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
                                    <span>Applied on: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</span>

                                    <button
                                        onClick={() => handleOpenDeleteModal(item)}
                                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                                        title="Cancel/Delete Request"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
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
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <div className="flex items-center gap-3 text-rose-500 mb-3">
                            <div className="p-2 bg-rose-500/10 rounded-xl">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Withdraw Request?</h3>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            Are you sure you want to withdraw your join request for{' '}
                            <span className="text-white font-medium">{selectedRequest.pitchTitle}</span>? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={handleCloseModal}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                            >
                                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                                {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MyPitchRequestsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20 text-gray-400"><Loader2 className="animate-spin" /></div>}>
            <MyPitchRequestsContent />
        </Suspense>
    );
}