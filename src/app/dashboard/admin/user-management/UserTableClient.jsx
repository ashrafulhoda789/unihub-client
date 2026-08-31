"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Shield, UserCheck, Mail, Calendar, Loader2, CheckCircle2, AlertCircle, X, Search } from "lucide-react";
import { updateUserRole } from "@/lib/action/users";
import Pagination from "@/components/common/Pagination";

export default function UserTableClient({ users }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState(null);

    const searchQuery = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "all";
    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 10;

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        userName: "",
        currentRole: "",
        newRole: "",
    });

    const updateQueryParam = (updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSearchChange = (e) => {
        updateQueryParam({ search: e.target.value, page: 1 });
    };

    const handleRoleFilterChange = (e) => {
        updateQueryParam({ role: e.target.value, page: 1 });
    };

    const handlePageChange = (page) => {
        updateQueryParam({ page });
    };

    // Filter and Search Logic
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const name = (user.name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const role = (user.role || "student").toLowerCase();

            const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "all" || role === roleFilter.toLowerCase();

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const handleSelectChange = (user, newRole) => {
        const currentRole = (user.role || "student").toLowerCase();
        if (currentRole === newRole.toLowerCase()) return;

        setConfirmModal({
            isOpen: true,
            userId: user?.id || user._id,
            userName: user.name || "Unnamed User",
            currentRole: currentRole,
            newRole: newRole.toLowerCase(),
        });
    };

    const handleConfirmRoleChange = async () => {
        const { userId, newRole } = confirmModal;
        setConfirmModal({ isOpen: false, userId: null, userName: "", currentRole: "", newRole: "" });
        setUpdatingId(userId);
        setMessage(null);

        const res = await updateUserRole(userId, newRole);

        if (res.success) {
            setMessage({ type: "success", text: "Role updated successfully!" });
            router.refresh();
            setTimeout(() => setMessage(null), 3000);
        }
        setUpdatingId(null);
    };

    return (
        <div className="space-y-4">
            {/* Success Toast */}
            {message && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> {message.text}
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl shadow-xl">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full bg-slate-950 border border-slate-700/85 rounded-xl pl-10 pr-4 py-2.5 sm:py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Role Filter Dropdown */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-400 shrink-0">Filter Role:</span>
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                        className="w-full sm:w-auto bg-slate-950 border border-slate-700/85 rounded-xl px-3 py-2.5 sm:py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer capitalize"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Users Content Container */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                {paginatedUsers.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-xs">
                        No users found.
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View (Hidden on Mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="py-4 px-6">User Profile</th>
                                        <th className="py-4 px-6">Email Address</th>
                                        <th className="py-4 px-6">Joined Date</th>
                                        <th className="py-4 px-6">Current Role</th>
                                        <th className="py-4 px-6 text-right">Change Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                                    {paginatedUsers.map((user) => {
                                        const userId = user?.id || user._id;
                                        const currentRole = (user.role || "student").toLowerCase();
                                        const isUpdating = updatingId === userId;

                                        return (
                                            <tr key={userId} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold uppercase shrink-0">
                                                            {user.name ? user.name[0] : "U"}
                                                        </div>


                                                        <span className="font-semibold text-white truncate max-w-[180px]">{user.name || "Unnamed User"}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-400">
                                                    <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                                                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {user.email}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <RoleBadge role={currentRole} />
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="inline-flex items-center gap-2 justify-end">
                                                        <select
                                                            disabled={isUpdating}
                                                            value={currentRole}
                                                            onChange={(e) => handleSelectChange(user, e.target.value)}
                                                            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="faculty">Faculty</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View (Visible only on Mobile/Small screens) */}
                        <div className="block md:hidden divide-y divide-slate-800/60">
                            {paginatedUsers.map((user) => {
                                const userId = user?.id || user._id;
                                const currentRole = (user.role || "student").toLowerCase();
                                const isUpdating = updatingId === userId;

                                return (
                                    <div key={userId} className="p-4 space-y-3 hover:bg-slate-800/20 transition-colors">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || "User"}
                                                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold uppercase shrink-0">
                                                        {user.name ? user.name[0] : "U"}
                                                    </div>
                                                )}
                                                <div className="overflow-hidden">
                                                    <h4 className="font-semibold text-white text-xs truncate">{user.name || "Unnamed User"}</h4>
                                                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3 text-slate-500 shrink-0" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <RoleBadge role={currentRole} />
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500">Role:</span>
                                                <select
                                                    disabled={isUpdating}
                                                    value={currentRole}
                                                    onChange={(e) => handleSelectChange(user, e.target.value)}
                                                    className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="faculty">Faculty</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                siblingCount={1}
            />

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
                        <button
                            onClick={() => setConfirmModal({ isOpen: false, userId: null, userName: "", currentRole: "", newRole: "" })}
                            className="absolute top-5 right-5 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Confirm Role Change</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to update this user&apos;s role?</p>
                            </div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
                            <p className="truncate"><span className="text-slate-500">User:</span> <strong className="text-white">{confirmModal.userName}</strong></p>
                            <p className="capitalize"><span className="text-slate-500">Change Role:</span> <span className="text-indigo-400">{confirmModal.currentRole}</span> → <span className="text-emerald-400">{confirmModal.newRole}</span></p>
                        </div>

                        <div className="flex items-center gap-3 justify-end pt-2">
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, userId: null, userName: "", currentRole: "", newRole: "" })}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRoleChange}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-colors"
                            >
                                Confirm & Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RoleBadge({ role }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize ${role === "admin"
            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            : role === "faculty"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            }`}>
            {role === "admin" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
            {role}
        </span>
    );
}