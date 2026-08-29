'use client';

import { useState, useEffect } from 'react';
import CurriculumCard from './CurriculumCard';
import CurriculumModal from './CurriculumModal';
import { getResources } from '@/lib/api/curriculum';
import { addCurriculumResource, updateResources, deleteResources } from '@/lib/action/curriculum';
import { BookCopy } from 'lucide-react';
import { useSession } from '@/lib/auth-client'; 

export default function CurriculumView() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const loadResources = async () => {
        if (!userEmail) return;
        try {
            setLoading(true);
            const res = await getResources(userEmail);
            if (res?.data) {
                setResources(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch curriculum data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadResources();
        }
    }, [userEmail]);

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
           
            const payload = {
                ...formData,
                uploadedBy: userEmail
            };

            if (selectedResource) {
                await updateResources(selectedResource._id, payload);
            } else {
                await addCurriculumResource(payload);
            }
            setIsModalOpen(false);
            setSelectedResource(null);
            loadResources();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this resource?")) {
            try {
                await deleteResources(id);
                loadResources();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d1527]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Curriculum Resources</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your uploaded course materials and study resources.</p>
                </div>
                <button
                    onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    + Add Curriculum
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
                    Loading your resources...
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center py-16 bg-[#0d1527]/60 backdrop-blur-md rounded-2xl border border-dashed border-slate-800 p-8">
                    <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <BookCopy />
                    </div>
                    <p className="text-slate-300 font-semibold text-lg">No curriculum resources found.</p>
                    <p className="text-xs text-slate-500 mt-1">Click + Add Curriculum to upload your first resource.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((item) => (
                        <CurriculumCard
                            key={item._id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <CurriculumModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedResource(null); }}
                onSubmit={handleFormSubmit}
                initialData={selectedResource}
                isSubmitting={submitting}
            />
        </div>
    );
}