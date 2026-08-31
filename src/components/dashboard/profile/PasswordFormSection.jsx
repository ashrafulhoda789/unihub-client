"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { updatePassword } from "@/lib/action/password";

export default function PasswordFormSection() {
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [msg, setMsg] = useState({ type: "", text: "" });

    const hasLength = passwords.newPassword.length >= 8;
    const hasNumber = /\d/.test(passwords.newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: "", text: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMsg({ type: "error", text: "New password and confirm password do not match!" });
            return;
        }

        if (!hasLength || !hasNumber) {
            setMsg({ type: "error", text: "Please fulfill the password requirements." });
            return;
        }

        setLoading(true);

        try {
            const res = await updatePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });

            if (res?.success || res?.status === 200) {
                setMsg({ type: "success", text: "Password changed successfully!" });
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMsg({ type: "error", text: res?.message || "Failed to change password." });
            }
        } catch (err) {
            setMsg({ type: "error", text: "An error occurred on the server." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Key size={18} className="text-indigo-400" /> Change Password
                </h3>
            </div>

            {msg.text && (
                <div className={`p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/60 text-red-400 border border-red-800/50'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">New Password</label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="At least 8 characters"
                            className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Validation Checkers */}
                <div className="flex flex-wrap gap-4 text-xs pt-1">
                    <span className={`flex items-center gap-1 ${hasLength ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                        <Check size={14} /> At least 8 characters
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                        <Check size={14} /> One number
                    </span>
                </div>

                <div className="flex justify-end pt-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
}