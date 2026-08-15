
"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/upload";
import { Eye, File, Link } from "lucide-react";

export default function SubmitProofModal({ isOpen, onClose, onSubmit, loading }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    // ফাইল সিলেক্ট হ্যান্ডলার
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setError("");

        // নতুন ট্যাবে দেখার জন্য অবজেক্ট URL তৈরি
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
    };

    // ফাইল রিমুভ হ্যান্ডলার
    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    // সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Please upload a file first.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            // Cloudinary-তে ফাইল আপলোড
            const uploadedData = await uploadToCloudinary(selectedFile);

            if (uploadedData?.url) {
                await onSubmit(uploadedData.url);
                handleRemoveFile();
                onClose();
            }
        } catch (err) {
            setError(err.message || "Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const isSubmitting = loading || uploading;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0b1329] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                <h3 className="text-base font-bold text-slate-100 mb-2">
                    🚀 Submit Task For Review
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                    Upload your proof document, screenshot, or video submission.
                </p>

                {error && (
                    <div className="mb-4 p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Input Box */}
                    {!selectedFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-[#060b19] rounded-xl cursor-pointer transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <span className="text-2xl mb-1">📁</span>
                                <p className="text-xs text-slate-300 font-medium">
                                    Click to upload proof file
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    SVG, PNG, JPG, MP4, or PDF
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*,video/*,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        /* File Selected & Preview Link Area */
                        <div className="bg-[#060b19] border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">

                                <File className="w-5 h-5 text-indigo-400 shrink-0" />

                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]" title={selectedFile?.name}>
                                        {selectedFile?.name}
                                    </span>

                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1 mt-0.5 w-fit"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Preview File</span>
                                        <Link className="w-2.5 h-2.5 text-indigo-400" />
                                    </a>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                disabled={isSubmitting}
                                className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs px-2 py-1 rounded-lg transition-colors ml-2"
                                title="Remove file"
                            >
                                Remove
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                handleRemoveFile();
                                onClose();
                            }}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Uploading & Submitting...</span>
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}