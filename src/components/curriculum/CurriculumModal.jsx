/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { uploadToCloudinary } from '@/lib/upload';
import { useState, useEffect } from 'react';

export default function CurriculumModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) {
    const [targetType, setTargetType] = useState('curriculum');

    const [formData, setFormData] = useState({
        title: '',
        courseName: '',
        courseId: '',
        documentType: 'pdf',
        semester: '1st',
        department: 'CSE',
        fileUrl: '',
        publicId: '',
        fileName: '',
        resources: [],
        description: '',
        highlights: [],
        highlightsInput: '',
        resourceLink: '',
        classroomCategory: 'mid'
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const isClassroom = initialData.targetType === 'classroom' || Boolean(initialData.classroomCategory);

            setFormData({
                title: initialData.title || '',
                courseName: initialData.courseName || '',
                courseId: initialData.courseId || '',
                documentType: initialData.documentType || 'pdf',
                semester: initialData.semester || '1st',
                department: initialData.department || 'CSE',
                fileUrl: initialData.fileUrl || '',
                publicId: initialData.publicId || '',
                fileName: initialData.fileName || '',
                description: initialData.description || '',
                highlights: initialData.highlights || [],
                highlightsInput: initialData.highlights ? initialData.highlights.join(', ') : '',
                resourceLink: initialData.resourceLink || '',
                classroomCategory: initialData.classroomCategory || 'mid',
                resources: Array.isArray(initialData.resources) ? initialData.resources : []
            });
            setTargetType(isClassroom ? 'classroom' : 'curriculum');
        } else {
            setFormData({
                title: '',
                courseName: '',
                courseId: '',
                documentType: 'pdf',
                semester: '1st',
                department: 'CSE',
                description: '',
                highlights: [],
                highlightsInput: '',
                resourceLink: '',
                fileUrl: '',
                publicId: '',
                fileName: '',
                resources: [],
                classroomCategory: 'mid'
            });
            setTargetType('curriculum');
        }
    }, [initialData, isOpen]);

    // Handle File Uploads (Curriculum -> Single, Classroom -> Multiple)
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            if (targetType === 'curriculum') {
                // Single file upload for Curriculum
                const file = files[0];
                const uploadRes = await uploadToCloudinary(file);
                if (uploadRes?.url) {
                    setFormData(prev => ({
                        ...prev,
                        fileUrl: uploadRes.url,
                        publicId: uploadRes.public_id || '',
                        fileName: file.name
                    }));
                }
            } else {
                // Multiple files upload for Classroom
                const uploadedFiles = await Promise.all(
                    files.map(async (file) => {
                        const uploadRes = await uploadToCloudinary(file);
                        return {
                            fileUrl: uploadRes?.url || '',
                            publicId: uploadRes?.public_id || '',
                            fileName: file.name
                        };
                    })
                );

                const validFiles = uploadedFiles.filter(item => item.fileUrl);

                setFormData(prev => ({
                    ...prev,
                    resources: [...prev.resources, ...validFiles]
                }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveResource = (index) => {
        setFormData(prev => ({
            ...prev,
            resources: prev.resources.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveSingleFile = () => {
        setFormData(prev => ({
            ...prev,
            fileUrl: '',
            publicId: '',
            fileName: ''
        }));
    };

    const handleHighlightsChange = (e) => {
        const value = e.target.value;
        const parsedArray = value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);

        setFormData(prev => ({
            ...prev,
            highlightsInput: value,
            highlights: parsedArray
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (targetType === 'classroom') {
            const classroomPayload = {
                title: formData.title,
                courseName: formData.courseName,
                courseId: formData.courseId,
                documentType: formData.documentType,
                semester: formData.semester,
                department: formData.department,
                resources: formData.resources,
                classroomCategory: formData.classroomCategory,
                targetType: 'classroom',
                targetCollection: 'classroom_resources'
            };
            onSubmit(classroomPayload);
        } else {
            const curriculumPayload = {
                title: formData.title,
                courseName: formData.courseName,
                courseId: formData.courseId,
                documentType: formData.documentType,
                semester: formData.semester,
                department: formData.department,
                description: formData.description,
                highlights: formData.highlights,
                resourceLink: formData.resourceLink,
                fileUrl: formData.fileUrl,
                publicId: formData.publicId,
                fileName: formData.fileName,
                targetType: 'curriculum',
                targetCollection: 'curriculum_resources'
            };
            onSubmit(curriculumPayload);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0d1527] border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">

                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">

                    {/* TYPE SELECTOR */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Resource Target Type
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setTargetType('curriculum')}
                                className={`py-2 text-xs font-bold rounded-lg transition-all ${targetType === 'curriculum'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                Curriculum Resource
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetType('classroom')}
                                className={`py-2 text-xs font-bold rounded-lg transition-all ${targetType === 'classroom'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                Classroom Resource
                            </button>
                        </div>
                    </div>

                    {/* CLASSROOM CATEGORY */}
                    {targetType === 'classroom' && (
                        <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-2 animate-in fade-in duration-200">
                            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                Classroom Category
                            </label>
                            <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                                {[
                                    { id: 'book', label: 'Book' },
                                    { id: 'mid', label: 'Midterm Exam' },
                                    { id: 'final', label: 'Final Exam' }
                                ].map((tab) => (
                                    <button
                                        type="button"
                                        key={tab.id}
                                        onClick={() => setFormData({ ...formData, classroomCategory: tab.id })}
                                        className={`py-1.5 text-xs font-semibold rounded-md transition-all ${formData.classroomCategory === tab.id
                                            ? 'bg-indigo-500 text-white shadow'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TITLE */}
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

                    {/* COURSE NAME & ID */}
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

                    {/* DOCUMENT TYPE, SEMESTER & DEPARTMENT */}
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

                    {/* CURRICULUM FIELDS */}
                    {targetType === 'curriculum' && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    rows="2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                                    placeholder="Brief description about this resource..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex justify-between">
                                    <span>Key Highlights</span>
                                    <span className="text-[10px] text-slate-400 lowercase">(separate with comma)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.highlightsInput}
                                    onChange={handleHighlightsChange}
                                    className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                                    placeholder="e.g., Dynamic Resizing Logic, Time Complexity, Heap Allocation"
                                />
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
                        </>
                    )}

                    {/* FILE UPLOAD SECTION (Conditional based on targetType) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            {targetType === 'classroom' ? 'Upload Files (Multiple Allowed)' : 'Upload File (Single File)'}
                        </label>
                        <input
                            type="file"
                            multiple={targetType === 'classroom'}
                            onChange={handleFileUpload}
                            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-indigo-500 hover:file:bg-blue-600/30 cursor-pointer"
                        />
                        {uploading && <p className="text-xs text-blue-400 mt-1 animate-pulse">Uploading file...</p>}

                        {/* Curriculum Single File View */}
                        {targetType === 'curriculum' && formData.fileUrl && (
                            <div className="mt-3 flex justify-between items-center text-xs bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                                <span className="text-emerald-400 truncate max-w-[85%]">✓ {formData.fileName || formData.fileUrl}</span>
                                <button
                                    type="button"
                                    onClick={handleRemoveSingleFile}
                                    className="text-rose-400 hover:text-rose-300 font-bold ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Classroom Multiple Files View */}
                        {targetType === 'classroom' && formData.resources.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                <p className="text-xs text-slate-400 font-semibold">Attached Resources ({formData.resources.length}):</p>
                                <ul className="space-y-1">
                                    {formData.resources.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-xs bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                                            <span className="text-emerald-400 truncate max-w-[80%]">✓ {item.fileName || item.fileUrl}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveResource(idx)}
                                                className="text-rose-400 hover:text-rose-300 font-bold ml-2"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* FOOTER BUTTONS */}
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