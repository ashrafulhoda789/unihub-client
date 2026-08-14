"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, X, FolderGit2, Users, ShieldAlert, Lock, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { deletePitch, updatePitch } from "@/lib/action/createPitch";
import DeletePitchModal from "@/components/modals/pitchModal/DeletePitchModal";


export default function PitchDetailClient({ initialPitch }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: initialPitch.title || "",
        category: initialPitch.category || "",
        description: initialPitch.description || "",
        requiredSkills: initialPitch.requiredSkills?.join(", ") || "",
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
            };
            const res = await updatePitch(initialPitch._id, payload);
            if (res?.success) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to update pitch", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await deletePitch(initialPitch._id);
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

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/student/my-pitches" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to My Pitches
                </Link>

                {!initialPitch.isFinalized && (
                    <div className="flex items-center gap-3">
                        {/* Delete Button */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>

                        {/* Edit / Save Button */}
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isEditing
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                                }`}
                        >
                            {loading ? "Saving..." : isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Pitch</>}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
                {isEditing && (
                    <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg">
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="space-y-6">
                    {/* Status & Category */}
                    <div className="flex flex-wrap items-center gap-3">
                        {isEditing ? (
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-indigo-400 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="DSA">DSA</option>
                                <option value="Web Dev">Web Dev</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Embedded Systems">Embedded Systems</option>
                                <option value="Cyber Security">Cyber Security</option>
                            </select>
                        ) : (
                            <span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
                                {formData.category}
                            </span>
                        )}

                        {initialPitch.isFinalized ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                                <Lock className="w-4 h-4" /> ACTIVE
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
                                <Clock className="w-4 h-4" /> {initialPitch.status}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-800/60 border border-indigo-500/50 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:outline-none"
                            />
                        ) : (
                            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                                <FolderGit2 className="w-8 h-8 text-indigo-500" /> {formData.title}
                            </h1>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-2">Project Description</h3>
                        {isEditing ? (
                            <textarea
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-800/60 border border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none leading-relaxed"
                            />
                        ) : (
                            <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                {formData.description}
                            </p>
                        )}
                    </div>

                    {/* Required Skills */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-2">Required Skills</h3>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.requiredSkills}
                                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                                placeholder="Comma separated skills..."
                                className="w-full bg-slate-800/60 border border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {formData.requiredSkills.split(",").map((skill, idx) => (
                                    <span key={idx} className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Read-Only Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <Users className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Team Members</p>
                            <p className="text-lg font-bold text-white">{initialPitch.members?.length || 1} Enrolled</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Supervisor Status</p>
                            <p className={`text-lg font-bold ${initialPitch.supervisionStatus === "ACCEPTED" ? "text-emerald-400" : "text-white"}`}>
                                {initialPitch.supervisionStatus}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Delete Modal */}
            <DeletePitchModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={initialPitch.title}
                deleting={deleting}
            />
        </div>
    );
}