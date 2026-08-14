"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderGit2 } from "lucide-react";
import CreatePitchModal from "@/components/modals/pitchModal/CreatePitchModal";
import PitchCard from "@/components/cards/PitchCard";

export default function MyPitchesClient({ initialPitches, user }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdate = () => {
        router.refresh();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                        <FolderGit2 className="w-7 h-7 text-indigo-400" /> My Project Pitches
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Manage proposals, review join requests, and lock your team for private workspaces.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                    <Plus className="w-4 h-4" /> Create Pitch
                </button>
            </div>

            {/* Pitch Grid */}
            {initialPitches.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-auto">
                    <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">No Pitches Found</h3>
                    <p className="text-xs text-slate-400 mb-6">Create your first pitch to form teams and request supervisors.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                    >
                        + Create First Pitch
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialPitches.map((pitch) => (
                        <PitchCard key={pitch._id} pitch={pitch} onUpdate={handleUpdate} />
                    ))}
                </div>
            )}

            <CreatePitchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPitchCreated={handleUpdate}
                user={user}
            />
        </div>
    );
}