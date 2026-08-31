"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, User, Mail, Link as LinkIcon, Loader2, CheckCircle } from "lucide-react";
import { uploadToCloudinary } from "@/lib/upload";
import { updateUserProfile } from "@/lib/action/users";

export default function ProfileFormSection({ initialUser }) {
    const [loading, setLoading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        userId: initialUser?._id || initialUser?.id || '',
        name: initialUser?.name || "",
        email: initialUser?.email || "",
        avatar: initialUser?.image || "",
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImg(true);
        setMessage({ type: "", text: "" });

        try {
            const uploadResult = await uploadToCloudinary(file);

            if (uploadResult?.url) {
                setFormData((prev) => ({ ...prev, avatar: uploadResult.url }));
                setMessage({ type: "success", text: "Image uploaded successfully! Click update to save changes." });
            } else {
                setMessage({ type: "error", text: "Image upload failed." });
            }
        } catch (err) {
            console.error("Image upload failed:", err);
            setMessage({ type: "error", text: err.message || "Error uploading image." });
        } finally {
            setUploadingImg(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const data = await updateUserProfile(formData);

            if (data?.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: data?.message || "Update failed." });
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setMessage({ type: "error", text: err?.message || "Server error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative group w-32 h-32">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-indigo-500/50 p-1 bg-slate-900 flex items-center justify-center relative">
                        {formData.avatar ? (
                            <Image
                                src={formData.avatar}
                                alt="Avatar"
                                width={128}
                                height={128}
                                className="rounded-full object-cover w-full h-full"
                            />
                        ) : (
                            <User className="w-16 h-16 text-slate-500" />
                        )}

                        {uploadingImg && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        )}
                    </div>

                    <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md cursor-pointer transition">
                        <Camera size={16} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImg} />
                    </label>
                </div>

                <div>
                    <h3 className="font-bold text-white text-lg">{formData.name || "User Name"}</h3>
                </div>
            </div>

            <div className="md:col-span-2 bg-[#121824] p-6 rounded-2xl border border-slate-800/80 shadow-sm space-y-5">
                <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Account Information</h3>

                {message.text && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/60 text-red-400 border border-red-800/50'}`}>
                        <CheckCircle size={16} /> {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                            <User size={14} className="text-indigo-400" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                            <Mail size={14} className="text-indigo-400" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 transition"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <LinkIcon size={14} className="text-indigo-400" /> Profile Picture URL (or upload on the left)
                    </label>
                    <input
                        type="text"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm bg-slate-900/60 text-white outline-none focus:border-indigo-500 transition"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading || uploadingImg}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Profile
                    </button>
                </div>
            </div>
        </form>
    );
}