// src/components/dashboard/workspace/WorkspaceView.jsx
"use client";

import CreateTaskModal from "@/components/dashboard/workspace/CreateTaskModal";
import KanbanBoard from "@/components/dashboard/workspace/KanbanBoard";
import PitchSidebar from "@/components/dashboard/workspace/PitchSidebar";
import { useState } from "react";
import { CgAdd } from "react-icons/cg";


export default function WorkspaceView({ workspace, initialTasks, currentUserId }) {
 
    const [tasks, setTasks] = useState(initialTasks || []);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


    const isSupervisor = workspace?.supervisorId?.toString() === currentUserId;
    const leadMember = workspace?.members?.find((m) => m.roleInTeam === "Lead Developer");
    const isLeadDev = leadMember && leadMember.userId?.toString() === currentUserId;


    const handleTaskCreated = (newTask) => {
        setTasks((prev) => [newTask, ...prev]);
    };

    const handleTaskUpdated = (taskId, newStatus, submissionUrl) => {
        setTasks((prev) =>
            prev.map((t) =>
                t._id === taskId
                    ? { ...t, status: newStatus, ...(submissionUrl && { submissionUrl }) }
                    : t
            )
        );
    };

    const handleTaskDeleted = (taskId) => {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };

    return (
        <div className="p-6 space-y-6">
            {/* Top Workspace Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0b1329] p-4 rounded-xl border border-slate-800">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">{workspace?.title} Workspace</h1>
                    <p className="text-xs text-slate-400">Manage tasks and track team progress.</p>
                </div>

                {/* শুধুমাত্র Supervisor ও Lead Developer বাটন দেখতে পাবে */}
                {(isSupervisor || isLeadDev) && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                        <span><CgAdd /></span> Create Task
                    </button>
                )}
            </div>

            {/* Layout Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar (Project Detail) */}
                <div className="lg:col-span-1">
                    <PitchSidebar pitch={workspace} currentUserId={currentUserId} />
                </div>

                {/* Right Area (Kanban Board) */}
                <div className="lg:col-span-3">
                    <KanbanBoard
                        tasks={tasks}
                        currentUserId={currentUserId}
                        isSupervisor={isSupervisor}
                        isLeadDev={isLeadDev}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                    />
                </div>
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                workspaceId={workspace?.workspaceId || workspace?._id}
                members={workspace?.members || []}
                currentUserId={currentUserId}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
}