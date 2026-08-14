"use client";

import { useState } from "react";
import { GraduationCap, UserCheck, ShieldCheck, CheckCircle2, X } from "lucide-react";

export default function RoleSelectionModal({ isOpen, onClose, onConfirm, loading }) {
    const [selectedRole, setSelectedRole] = useState("student"); // Default role: student

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(selectedRole);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-3">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Select Your Academic Role</h3>
                    <p className="text-xs text-slate-400 mt-1">
                        Choose your role on UniHub to personalize your workspace & permissions.
                    </p>
                </div>

                {/* Role Options */}
                <div className="space-y-3 mb-6">
                    {/* Student Role Option */}
                    <div
                        onClick={() => setSelectedRole("student")}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${selectedRole === "student"
                                ? "bg-indigo-600/10 border-indigo-500 text-white"
                                : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300"
                            }`}
                    >
                        <div className={`p-2.5 rounded-lg ${selectedRole === "student" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-white">Student</h4>
                                {selectedRole === "student" && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Pitch project ideas, find team members, submit deliverables, and practice coding[cite: 7].
                            </p>
                        </div>
                    </div>

                    {/* Faculty / Teacher Role Option */}
                    <div
                        onClick={() => setSelectedRole("faculty")}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${selectedRole === "faculty"
                                ? "bg-cyan-600/10 border-cyan-500 text-white"
                                : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300"
                            }`}
                    >
                        <div className={`p-2.5 rounded-lg ${selectedRole === "faculty" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-white">Faculty Member / Supervisor</h4>
                                {selectedRole === "faculty" && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Supervise student projects, validate Kanban task milestones, and address learning gaps[cite: 7].
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? "Completing Registration..." : "Complete Account Creation"}
                </button>
            </div>
        </div>
    );
}