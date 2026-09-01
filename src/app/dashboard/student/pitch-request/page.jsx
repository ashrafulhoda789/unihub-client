/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trash2, AlertTriangle, ExternalLink, Loader2, Clock, CheckCircle2, XCircle, Search, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { deletePitchRequest } from '@/lib/action/joinRequest';
import { getUserJoinRequests } from '@/lib/api/joinRequest';
import { useSession } from '@/lib/auth-client';
import Pagination from '@/components/common/Pagination';

export default function MyPitchRequestsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialStatus = searchParams.get('status') || 'ALL';
    const initialQuery = searchParams.get('search') || '';
    const initialPage = Number(searchParams.get('page')) || 1;

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [statusFilter, setStatusFilter] = useState(initialStatus);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(initialPage);
    const itemsPerPage = 6;

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id || "";

    const updateURL = useCallback((status, query, page) => {
        const params = new URLSearchParams();
        if (status && status !== 'ALL') params.set('status', status);
        if (query) params.set('search', query);
        if (page && page > 1) params.set('page', page);

        const queryString = params.toString();
        const url = queryString ? `?${queryString}` : window.location.pathname;
        router.replace(url, { scroll: false });
    }, [router]);

    const fetchRequests = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await getUserJoinRequests(userId);
            if (res?.success) {
                setRequests(res.data || []);
            } else {
                setError(res?.error || "Failed to fetch pitch requests");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        setCurrentPage(1);
        updateURL(status, searchQuery, 1);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentPage(1);
        updateURL(statusFilter, query, 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateURL(statusFilter, searchQuery, page);
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
            }
        } catch (err) {
            // Error handling
        } finally {
            setIsDeleting(false);
        }
    };

    // Filtered requests based on search query and status filter
    const filteredRequests = useMemo(() => {
        return requests.filter((item) => {
            const title = (item.pitchTitle || "").toLowerCase();
            const role = (item.role || "").toLowerCase();
            const message = (item.message || "").toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = title.includes(query) || role.includes(query) || message.includes(query);

            const itemStatus = (item.status || 'PENDING').toUpperCase();
            const matchesStatus = statusFilter === 'ALL' || itemStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    // Paginated requests
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, currentPage, itemsPerPage]);

    const renderStatusBadge = (status) => {
        const formattedStatus = (status || 'PENDING').toUpperCase();
        switch (formattedStatus) {
            case 'ACCEPTED':
            case 'APPROVED':
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
                <p className="text-sm">Fetching your requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center max-w-xl mx-auto my-8">
                <p className="mb-3">{error}</p>
                <button onClick={fetchRequests} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="border-b border-slate-800/80 pb-6 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Pitch Requests</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Manage and track all join requests you submitted to team pitches.
                </p>
            </div>

            {/* Filter and Search Bar Container */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-lg">

                {/* Status Dropdown Filter */}
                <div className="relative w-full lg:w-56">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none flex items-center gap-2">
                        <Filter size={16} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition appearance-none cursor-pointer"
                    >
                        <option value="ALL" className="bg-slate-900 text-white">ALL STATUS</option>
                        <option value="PENDING" className="bg-slate-900 text-white">PENDING</option>
                        <option value="ACCEPTED" className="bg-slate-900 text-white">ACCEPTED</option>
                        <option value="REJECTED" className="bg-slate-900 text-white">REJECTED</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={16} />
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search pitch, role or message..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-gray-900/50 border border-gray-800 rounded-2xl">
                    <p className="text-gray-400 text-base mb-4">You have not submitted any pitch join requests yet.</p>
                    <Link
                        href="/pitches"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition"
                    >
                        Browse Pitches <ExternalLink size={16} />
                    </Link>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-2xl">
                    <p className="text-gray-400 text-sm">No matching pitch requests found.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedRequests.map((item) => (
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
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

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