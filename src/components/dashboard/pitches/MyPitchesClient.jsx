"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderGit2, Search } from "lucide-react";
import CreatePitchModal from "@/components/modals/pitchModal/CreatePitchModal";
import PitchCard from "@/components/cards/PitchCard";

export default function MyPitchesClient({ initialPitches, user }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState("ALL"); // "ALL" | "MY_PITCH"

    const currentUserId = user?.id || user?._id;

    const handleUpdate = () => {
        router.refresh();
    };

    // Real-time Search and Filter Logic
    const filteredPitches = useMemo(() => {
        return initialPitches.filter((pitch) => {
            // Check Owner Condition
            const isOwner = pitch.createdBy?.toString() === currentUserId?.toString();

            // Filter Tab Condition
            if (filterTab === "MY_PITCH" && !isOwner) {
                return false;
            }

            // Search Query Condition (Title, Description, Skills)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const titleMatch = pitch.title?.toLowerCase().includes(query);
                const descMatch = pitch.description?.toLowerCase().includes(query);
                const skillMatch = pitch.requiredSkills?.some(s => s.toLowerCase().includes(query));

                return titleMatch || descMatch || skillMatch;
            }

            return true;
        });
    }, [initialPitches, filterTab, searchQuery, currentUserId]);

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

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setFilterTab("ALL")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === "ALL"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        All ({initialPitches.length})
                    </button>
                    <button
                        onClick={() => setFilterTab("MY_PITCH")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === "MY_PITCH"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        My Pitch ({initialPitches.filter(p => p.createdBy?.toString() === currentUserId?.toString()).length})
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search pitches or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Pitch Grid */}
            {filteredPitches.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-auto">
                    <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">No Pitches Found</h3>
                    <p className="text-xs text-slate-400 mb-6">
                        {searchQuery || filterTab !== "ALL"
                            ? "No pitches match your filter criteria."
                            : "Create your first pitch to form teams and request supervisors."}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                    >
                        + Create First Pitch
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPitches.map((pitch) => (
                        <PitchCard
                            key={pitch._id}
                            pitch={pitch}
                            onUpdate={handleUpdate}
                            currentUserId={currentUserId}
                        />
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