"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Edit2, Save, X, FolderGit2, Users, ShieldAlert,
    Lock, Clock, Trash2, UserPlus, Check, Mail, User, Briefcase,
    CheckCircle2, XCircle, Loader2, AlertTriangle, UserMinus, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { deletePitch, handleJoinRequestAction, updatePitch } from "@/lib/action/createPitch";
import DeletePitchModal from "@/components/modals/pitchModal/DeletePitchModal";
import { useSession } from "@/lib/auth-client";
import { acceptJoinRequest, deleteTeamMember } from "@/lib/action/joinRequest";
import { assignSupervisor } from "@/lib/action/assignSupervisor";
import ConfirmModal from "@/components/modals/pitchModal/SuperVisorChangeConfirmModal";

export default function PitchDetailClient({ initialPitch }) {
    const router = useRouter();
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    // Pitch state
    const [pitch, setPitch] = useState(initialPitch);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Member Deletion states
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [deletingMember, setDeletingMember] = useState(false);

    // Single Request Delete/Reject state
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [deletingRequest, setDeletingRequest] = useState(false);

    // Clear All Requests Modal state
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [clearingAll, setClearingAll] = useState(false);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDanger: false,
        confirmText: 'Confirm'
    });

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    // Error & Loading states
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [activeTab, setActiveTab] = useState("PENDING"); // 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL'

    // Edit form state
    const [formData, setFormData] = useState({
        title: pitch?.title || "",
        category: pitch?.category || "",
        description: pitch?.description || "",
        requiredSkills: Array.isArray(pitch?.requiredSkills)
            ? pitch.requiredSkills.join(", ")
            : pitch?.requiredSkills || "",
    });

    // Pitch Save / Update
    const handleSave = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const payload = {
                ...formData,
                requiredSkills: formData.requiredSkills
                    ? formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
                    : [],
            };
            const res = await updatePitch(pitch._id, payload);
            if (res?.success) {
                setPitch((prev) => ({ ...prev, ...payload }));
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to update pitch", error);
        } finally {
            setLoading(false);
        }
    };

    // Pitch Delete
    const handleDeletePitch = async () => {
        setDeleting(true);
        try {
            const res = await deletePitch(pitch._id);
            if (res?.success) {
                router.push("/dashboard/student/my-pitches");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to delete pitch", error);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Confirm Team Member Delete
    const handleConfirmRemoveMember = async () => {
        if (!memberToDelete) return;
        setErrorMessage("");

        const targetUserId = memberToDelete.userId?._id || memberToDelete.userId || memberToDelete._id;

        if (currentUserId === targetUserId?.toString()) {
            setErrorMessage("You cannot remove yourself from the team.");
            return;
        }

        try {
            setDeletingMember(true);
            const res = await deleteTeamMember(pitch._id, targetUserId);

            if (res?.success) {
                setPitch((prev) => ({
                    ...prev,
                    members: (prev.members || []).filter((m) => {
                        const mId = m.userId?._id || m.userId || m._id;
                        return mId?.toString() !== targetUserId?.toString();
                    }),
                }));
                router.refresh();
                setMemberToDelete(null);
            }
        } catch (error) {
            console.error("Failed to remove team member", error);
        } finally {
            setDeletingMember(false);
        }
    };

    // Accept Request Action
    const handleAcceptRequest = async (requestId) => {
        setActionLoadingId(requestId);
        setErrorMessage("");
        try {
            const res = await acceptJoinRequest(pitch._id, requestId);
            if (res?.success) {
                setPitch((prev) => {
                    const updatedRequests = (prev.joinRequests || []).map((r) =>
                        r._id?.toString() === requestId ? { ...r, status: "ACCEPTED" } : r
                    );
                    const newMember = res.member || {
                        userId: requestId,
                        name: "New Member",
                        email: "N/A",
                        role: "Member",
                    };
                    return {
                        ...prev,
                        joinRequests: updatedRequests,
                        members: [...(prev.members || []), newMember],
                    };
                });
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to accept request", error);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Reject / Delete Single Join Request Action
    const handleRejectOrDeleteRequest = async (requestId) => {
        setActionLoadingId(requestId);
        setErrorMessage("");
        try {
            const res = await handleJoinRequestAction(pitch._id, {
                requestId,
                action: "REJECTED",
            });

            if (res?.success) {
                setPitch((prev) => ({
                    ...prev,
                    joinRequests: (prev.joinRequests || []).map((r) =>
                        r._id?.toString() === requestId ? { ...r, status: "REJECTED" } : r
                    ),
                }));
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to reject request", error);
        } finally {
            setActionLoadingId(null);
            setRequestToDelete(null);
        }
    };

    const handleChangeSupervisor = () => {
        setModalConfig({
            isOpen: true,
            title: "Change Supervisor",
            message: "Are you sure you want to unassign the current supervisor?",
            isDanger: true,
            confirmText: "Yes, Unassign",
            onConfirm: async () => {
                closeModal();
                try {
                    const res = await assignSupervisor(pitch?._id, { supervisorId: null });
                    if (res?.success) {
                        setPitch((prev) => ({
                            ...prev,
                            supervisionStatus: "UNASSIGNED",
                            supervisorId: null,
                            supervisorDetails: null
                        }));

                        if (typeof fetchPitchDetails === "function") {
                            fetchPitchDetails();
                        }
                    } else {
                        // Alert-এর জায়গায় Modal Error
                        showErrorModal(res?.message || res?.error || "Failed to unassign supervisor");
                    }
                } catch (error) {
                    console.error("Error changing supervisor:", error);
                    showErrorModal("An unexpected error occurred.");
                }
            }
        });
    };

    const handleAssignSupervisor = (supervisor) => {
        const pitchId = pitch?._id;

        if (!pitchId) {
            showErrorModal("Pitch ID missing!");
            return;
        }

        setModalConfig({
            isOpen: true,
            title: "Assign Supervisor",
            message: `Are you sure you want to assign ${supervisor.name} as the Supervisor?`,
            isDanger: false,
            confirmText: "Assign",
            onConfirm: async () => {
                closeModal();
                try {
                    const supervisorData = {
                        supervisorId: supervisor?.userId,
                        name: supervisor.name,
                        email: supervisor.email,
                    };

                    const res = await assignSupervisor(pitchId, supervisorData);

                    if (res?.success) {
                        setPitch((prev) => ({
                            ...prev,
                            supervisionStatus: "ASSIGNED",
                            supervisor: res.supervisor || supervisorData,
                        }));

                        if (typeof fetchPitchDetails === "function") {
                            fetchPitchDetails();
                        }
                    } else {
                        showErrorModal(res?.message || res?.error || "Failed to assign supervisor");
                    }
                } catch (error) {
                    console.error("Error assigning supervisor:", error);
                    showErrorModal("An unexpected error occurred.");
                }
            }
        });
    };

    const showErrorModal = (msg) => {
        setModalConfig({
            isOpen: true,
            title: "Error",
            message: msg,
            isDanger: true,
            confirmText: "OK",
            onConfirm: () => closeModal()
        });
    };

    // Filter Join Requests
    const filteredRequests = (pitch?.joinRequests || []).filter((req) => {
        if (activeTab === "ALL") return true;
        return req.status === activeTab;
    });

    const pendingCount = (pitch?.joinRequests || []).filter(r => r.status === "PENDING").length;
    const acceptedCount = (pitch?.joinRequests || []).filter(r => r.status === "ACCEPTED").length;
    const rejectedCount = (pitch?.joinRequests || []).filter(r => r.status === "REJECTED").length;
    const totalCount = (pitch?.joinRequests || []).length;

    return (
        <div className="min-h-screen bg-[#060813] text-slate-100 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Navigation & Action Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/dashboard/student/my-pitches"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Pitches
                    </Link>

                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-slate-700 bg-slate-900 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4 text-rose-400" /> Delete
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit Pitch
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                        <button onClick={() => setErrorMessage("")}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Pitch Details Box */}
                <div className="bg-[#0b1021] border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#060813] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#060813] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#060813] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Required Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.requiredSkills}
                                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#060813] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <span className="px-3.5 py-1 bg-indigo-950/70 border border-indigo-800/60 text-indigo-400 text-xs font-semibold rounded-md">
                                    {pitch?.category || "Web Dev"}
                                </span>
                                <span className="px-3.5 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs font-bold rounded-md flex items-center gap-1.5 uppercase tracking-wider">
                                    <Clock className="w-3.5 h-3.5" /> MATCHING
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FolderGit2 className="w-7 h-7 text-indigo-400" />
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                    {pitch?.title || "UniHub - academic ecosystem"}
                                </h1>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-300">Project Description</h4>
                                <div className="p-4 bg-[#060813]/60 border border-slate-800/60 rounded-xl text-slate-300 text-sm leading-relaxed">
                                    {pitch?.description || "An academic collaboration and ecosystem with resource library."}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-300">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(pitch?.requiredSkills) && pitch.requiredSkills.length > 0 ? (
                                        pitch.requiredSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3.5 py-1.5 bg-[#12182e] border border-slate-700/60 text-slate-300 text-xs rounded-lg font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-500">No specific skills listed.</span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Grid Layout: Team Members + Supervisor Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Team Members Card */}
                    <div className="bg-[#0b1021] border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-400 shrink-0" />
                                Team Members
                            </h3>
                            <span className="px-3 py-1 bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 text-xs font-semibold rounded-full">
                                {pitch?.members?.length || 0} Enrolled
                            </span>
                        </div>

                        {/* Members List */}
                        {pitch?.members?.length > 0 ? (
                            <div className="space-y-3">
                                {pitch.members.map((member, i) => {
                                    const memberUserId = member.userId;
                                    const shortId = memberUserId ? memberUserId.toString().slice(-4) : `${i + 1}`;
                                    const isSupervisorRole = member.roleInTeam === "Supervisor" || member.role === "Supervisor";

                                    return (
                                        <div
                                            key={i}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#060813]/80 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors gap-3"
                                        >
                                            {/* Member Info */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 bg-indigo-950/80 border border-indigo-800/60 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                                                    M{i + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-bold text-slate-100 truncate">
                                                        {member.name || member.userId?.name || `Member (${shortId})`}
                                                    </div>
                                                    <div className="text-xs text-slate-500 truncate font-mono">
                                                        {member.email || member.userId?.email || "No email available"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions & Role Badge */}
                                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 shrink-0">
                                                <span className="px-2.5 py-1 bg-[#12182e] border border-slate-700/60 text-slate-300 text-xs font-medium rounded-lg">
                                                    {member.role || member.roleInTeam || "Member"}
                                                </span>

                                                {isSupervisorRole && pitch.supervisionStatus !== "ASSIGNED" && (
                                                    <button
                                                        onClick={() => handleAssignSupervisor(member)}
                                                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white rounded-lg transition-all shadow-sm active:scale-95"
                                                    >
                                                        Assign as Supervisor
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setMemberToDelete(member)}
                                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors ml-auto sm:ml-0"
                                                    title="Remove Member"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic py-4 text-center">No members added yet.</p>
                        )}
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${pitch.supervisionStatus === 'ASSIGNED'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-cyan-500/10 text-cyan-400'
                                }`}>
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                                    Supervisor Status
                                </p>
                                <h3 className={`text-xl font-bold ${pitch.supervisionStatus === 'ASSIGNED' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                    {pitch.supervisionStatus || "UNASSIGNED"}
                                </h3>
                            </div>
                        </div>

                        {pitch.supervisionStatus === "ASSIGNED" && (() => {
                            const supervisor = pitch.members?.find(
                                m => m.roleInTeam === "Supervisor" || m.userId?.toString() === pitch.supervisorId?.toString()
                            );

                            if (!supervisor) return null;

                            return (
                                <div className="mt-4 pt-4 border-t border-slate-800/80">

                                    <div className="flex items-center justify-between mb-2.5">
                                        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-400">
                                            Assigned Supervisor
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Active
                                            </span>

                                            <button
                                                onClick={handleChangeSupervisor}
                                                className="text-xs text-amber-400 hover:text-amber-300 font-semibold hover:underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-200 group">
                                        {/* Avatar Icon / Initial */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm shadow-inner group-hover:scale-105 transition-transform duration-200">
                                                {supervisor.name ? supervisor.name.charAt(0).toUpperCase() : "S"}
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                                        </div>

                                        {/* Supervisor Details */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                                                {supervisor.name || "N/A"}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                                                <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-slate-400 truncate font-mono">
                                                    {supervisor.email || "No email available"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {pitch.supervisionStatus !== "ASSIGNED" && (
                            <p className="text-xs text-slate-500 mt-2">
                                Select a team member with role Supervisor below to assign them.
                            </p>
                        )}
                    </div>

                </div>

                {/* Peer Join Requests Section */}
                <div className="bg-[#0b1021] border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-indigo-400" />
                            Peer Join Requests
                        </h3>

                        {/* Filter Pill Tabs */}
                        <div className="flex bg-[#060813] border border-slate-800/80 p-1 rounded-xl text-xs font-semibold">
                            <button
                                onClick={() => setActiveTab("PENDING")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "PENDING"
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                Pending ({pendingCount})
                            </button>
                            <button
                                onClick={() => setActiveTab("ACCEPTED")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "ACCEPTED"
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                Accepted ({acceptedCount})
                            </button>
                            <button
                                onClick={() => setActiveTab("REJECTED")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "REJECTED"
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                Rejected ({rejectedCount})
                            </button>
                            <button
                                onClick={() => setActiveTab("ALL")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "ALL"
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                All ({totalCount})
                            </button>
                        </div>
                    </div>

                    {/* Empty State / Request List */}
                    {filteredRequests.length > 0 ? (
                        <div className="space-y-3">
                            {filteredRequests.map((req) => {
                                const reqId = req._id?.toString() || req._id;
                                const isLoading = actionLoadingId === reqId;

                                return (
                                    <div
                                        key={reqId}
                                        className="p-4 bg-[#060813]/80 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-white text-sm">
                                                    {req.applicantName || "Unknown Applicant"}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${req.status === "PENDING"
                                                        ? "bg-amber-950/60 border border-amber-800/60 text-amber-400"
                                                        : req.status === "ACCEPTED"
                                                            ? "bg-emerald-950/60 border border-emerald-800/60 text-emerald-400"
                                                            : "bg-rose-950/60 border border-rose-800/60 text-rose-400"
                                                        }`}
                                                >
                                                    {req.status}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-400 flex items-center gap-3">
                                                <span>{req.applicantEmail}</span>
                                                <span>•</span>
                                                <span className="font-medium text-slate-300">
                                                    Role: {req.role}
                                                </span>
                                            </div>

                                            {req.message && (
                                                <p className="text-xs text-slate-400 pt-1 italic">
                                                    {req.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {req.status === "PENDING" && (
                                                <>
                                                    <button
                                                        disabled={isLoading}
                                                        onClick={() => handleAcceptRequest(reqId)}
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5" />
                                                        )}
                                                        Accept
                                                    </button>

                                                    <button
                                                        disabled={isLoading}
                                                        onClick={() => handleRejectOrDeleteRequest(reqId)}
                                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </>
                                            )}

                                            {req.status !== "PENDING" && (
                                                <button
                                                    onClick={() => handleRejectOrDeleteRequest(reqId)}
                                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                                                    title="Delete Request"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-[#060813]/30">
                            <UserPlus className="w-8 h-8 text-slate-600" />
                            <p className="text-xs text-slate-400 font-medium">
                                No pending join requests for this pitch.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showDeleteModal && (
                <DeletePitchModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeletePitch}
                    loading={deleting}
                />
            )}

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                isDanger={modalConfig.isDanger}
            />


            {memberToDelete && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#0b1021] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-400" /> Remove Team Member
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Are you sure you want to remove{" "}
                            <span className="font-semibold text-white">
                                {memberToDelete.name || "this member"}
                            </span>{" "}
                            from the pitch?
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setMemberToDelete(null)}
                                className="px-4 py-2 border border-slate-700 bg-slate-900 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deletingMember}
                                onClick={handleConfirmRemoveMember}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-500 flex items-center gap-2 disabled:opacity-50"
                            >
                                {deletingMember && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}