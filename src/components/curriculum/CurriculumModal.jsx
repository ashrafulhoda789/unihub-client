'use client';

import { uploadToCloudinary } from '@/lib/upload';
import { useState, useEffect } from 'react';

export default function CurriculumModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) {
    const [formData, setFormData] = useState({
        title: '',
        courseName: '',
        courseId: '',
        documentType: 'pdf',
        semester: '1st',
        department: 'CSE',
        description: '',
        resourceLink: '',
        fileUrl: '',
        publicId: ''
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                courseName: '',
                courseId: '',
                documentType: 'pdf',
                semester: '1st',
                department: 'CSE',
                description: '',
                resourceLink: '',
                fileUrl: '',
                publicId: ''
            });
        }
    }, [initialData, isOpen]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadRes = await uploadToCloudinary(file);

            if (uploadRes?.url) {
                setFormData(prev => ({
                    ...prev,
                    fileUrl: uploadRes.url,
                    documentType: uploadRes.type // 'pdf' | 'image' | 'video' | 'document'
                }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0d1527] border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Curriculum Resource' : 'Add New Curriculum Resource'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="e.g., Data Structures Lecture Notes"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Course Name</label>
                            <input
                                type="text"
                                required
                                value={formData.courseName}
                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                                placeholder="e.g., Algorithm Design"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Course ID</label>
                            <input
                                type="text"
                                required
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                                placeholder="e.g., CSE-2101"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Document Type</label>
                            <select
                                value={formData.documentType}
                                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            >
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                                <option value="slide">Slide / Presentation</option>
                                <option value="doc">Document</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                            <select
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            >
                                <option value="1st">1st Semester</option>
                                <option value="2nd">2nd Semester</option>
                                <option value="3rd">3rd Semester</option>
                                <option value="4th">4th Semester</option>
                                <option value="5th">5th Semester</option>
                                <option value="6th">6th Semester</option>
                                <option value="7th">7th Semester</option>
                                <option value="8th">8th Semester</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            >
                                <option value="CSE">CSE</option>
                                <option value="EEE">EEE</option>
                                <option value="ECE">ECE</option>
                                <option value="Civil">Civil</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="Brief description about this resource..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload File (Cloudinary)</label>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-indigo-500 hover:file:bg-blue-600/30 cursor-pointer"
                        />
                        {uploading && <p className="text-xs text-blue-400 mt-1">Uploading file...</p>}
                        {formData.fileUrl && <p className="text-xs text-emerald-400 mt-1">✓ File Attached</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Similar Resource Link</label>
                        <input
                            type="url"
                            value={formData.resourceLink}
                            onChange={(e) => setFormData({ ...formData, resourceLink: e.target.value })}
                            className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="https://example.com/reference"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : initialData ? 'Update Resource' : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}