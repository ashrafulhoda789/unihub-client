"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SubmitProofModal from "./SubmitProofModal";
import TaskDetailModal from "./TaskDetailModal";
import { deleteTask, updateTaskStatus } from "@/lib/action/tasks";

const MAIN_COLUMNS = [
    { id: "TODO", label: "To Do", color: "border-slate-700 bg-slate-800/20 text-slate-300" },
    { id: "IN_PROGRESS", label: "In Progress", color: "border-blue-800/40 bg-blue-950/20 text-blue-400" },
    { id: "IN_REVIEW", label: "In Review", color: "border-purple-800/40 bg-purple-950/20 text-purple-400" },
    { id: "DONE", label: "Done", color: "border-emerald-800/40 bg-emerald-950/20 text-emerald-400" },
];

const BACKLOG_COLUMN = {
    id: "BACKLOG",
    label: "Backlog (Overdue Tasks)",
    color: "border-rose-800/40 bg-rose-950/20 text-rose-400",
};

export default function KanbanBoard({
    tasks = [],
    currentUserId,
    isSupervisor,
    isLeadDev,
    onTaskUpdated,
    onTaskDeleted
}) {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedTaskForReview, setSelectedTaskForReview] = useState(null);
    const [loadingTaskId, setLoadingTaskId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // Task Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);

    // Delete Confirmation Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const safeTasks = Array.isArray(tasks) ? tasks : [];

    // Status Change Handler
    const handleStatusChange = async (taskId, targetStatus, submissionUrl = null) => {
        setLoadingTaskId(taskId);
        try {
            const res = await updateTaskStatus(taskId, {
                targetStatus,
                userId: currentUserId,
                submissionUrl,
            });

            if (res.success) {
                onTaskUpdated(taskId, targetStatus, submissionUrl);

                if (selectedTaskForDetail && selectedTaskForDetail._id === taskId) {
                    setSelectedTaskForDetail((prev) => ({ ...prev, status: targetStatus, submissionUrl }));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTaskId(null);
        }
    };

    const initiateStatusChange = (task, newStatus) => {
        if (newStatus === "DONE" && !isSupervisor) {
            setModalMessage("Only Supervisor can move tasks to DONE.");
            setIsModalOpen(true);
            return;
        }

        if (newStatus === "IN_REVIEW") {
            setSelectedTaskForReview({ taskId: task._id, targetStatus: newStatus });
            setReviewModalOpen(true);
        } else {
            handleStatusChange(task._id, newStatus);
        }
    };

    const handleProofSubmit = (submissionUrl) => {
        if (selectedTaskForReview) {
            handleStatusChange(selectedTaskForReview.taskId, selectedTaskForReview.targetStatus, submissionUrl);
            setReviewModalOpen(false);
            setSelectedTaskForReview(null);
        }
    };

    // Card click event handler
    const handleCardClick = (task) => {
        setSelectedTaskForDetail(task);
        setDetailModalOpen(true);
    };

    const openDeleteConfirmModal = (taskId) => {
        setTaskToDeleteId(taskId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDeleteId) return;
        setIsDeleting(true);
        try {
            const res = await deleteTask(taskToDeleteId);
            if (res?.success) {
                onTaskDeleted(taskToDeleteId);
                if (selectedTaskForDetail?._id === taskToDeleteId) {
                    setDetailModalOpen(false);
                    setSelectedTaskForDetail(null);
                }
            }
        } catch (err) {
            console.error("Failed to delete task:", err);
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setTaskToDeleteId(null);
        }
    };

    // Drag End Handler
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const targetStatus = destination.droppableId;
        const task = safeTasks.find((t) => t._id === draggableId);

        if (!task) return;

        initiateStatusChange(task, targetStatus);
    };

    // Card Renderer
    const renderTaskCard = (task, index, isBacklog = false) => (
        <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => handleCardClick(task)}
                    className={`bg-[#060b19] border border-slate-800/90 rounded-xl p-3 sm:p-3.5 space-y-2.5 sm:space-y-3 hover:border-slate-700 transition-all shadow-md group relative cursor-pointer ${snapshot.isDragging ? "shadow-2xl border-indigo-500 ring-2 ring-indigo-500/20" : ""
                        }`}
                >
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                            {task.title}
                        </h4>
                        {(isSupervisor || isLeadDev) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Modal ওপেন না হয়ে যাতে শুধু ডিলিট ট্রিগার হয়
                                    openDeleteConfirmModal(task._id);
                                }}
                                className="text-slate-400 sm:text-slate-500 hover:text-rose-400 text-xs sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-rose-950/30 shrink-0"
                                title="Delete Task"
                            >
                                🗑️
                            </button>
                        )}
                    </div>

                    {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {task.submissionUrl && (
                        <div
                            className="p-1.5 bg-indigo-950/40 border border-indigo-800/30 rounded text-[10px] break-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-slate-400">Submission: </span>
                            <a
                                href={task.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 underline truncate inline-block max-w-[140px] xs:max-w-[180px] align-bottom"
                            >
                                View Proof Link
                            </a>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                        <div className="flex -space-x-1 overflow-hidden shrink-0">
                            {task.assigneeDetails?.map((assignee, idx) => (
                                <div
                                    key={idx}
                                    title={assignee.name || "User"}
                                    className="w-5 h-5 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[9px] font-bold text-white uppercase"
                                >
                                    {assignee.name ? assignee.name.charAt(0) : "U"}
                                </div>
                            ))}
                        </div>
                        <span className={`truncate ${isBacklog ? "text-rose-400 font-semibold" : ""}`}>
                            📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date"}
                        </span>
                    </div>

                    {!isBacklog && (
                        <div
                            className="pt-2 border-t border-slate-800/40 flex items-center justify-between gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-[10px] text-slate-500 shrink-0">Move to:</span>
                            <select
                                value={task.status}
                                disabled={loadingTaskId === task._id}
                                onChange={(e) => initiateStatusChange(task, e.target.value)}
                                className="bg-[#0b1329] border border-slate-800 text-[10px] text-slate-300 rounded px-1.5 py-1 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="IN_REVIEW">In Review</option>
                                {isSupervisor && <option value="DONE">Done</option>}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );

    const backlogTasks = safeTasks.filter((t) => t.status === "BACKLOG");

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-full space-y-4 sm:space-y-6 pb-6">

                {/* 1. Main Columns */}
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MAIN_COLUMNS.map((column) => {
                            const columnTasks = safeTasks.filter((t) => t.status === column.id);

                            return (
                                <div
                                    key={column.id}
                                    className="bg-[#0b1329]/60 border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[250px] sm:min-h-[350px] lg:h-[70vh]"
                                >
                                    <div className={`p-2.5 border rounded-lg mb-3 flex justify-between items-center ${column.color}`}>
                                        <span className="font-bold text-xs uppercase tracking-wider">{column.label}</span>
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-black/40 rounded-full">
                                            {columnTasks.length}
                                        </span>
                                    </div>

                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-1 overflow-y-auto space-y-3 pr-1 rounded-lg transition-colors min-h-[150px] ${snapshot.isDraggingOver ? "bg-slate-800/30 ring-1 ring-slate-700" : ""
                                                    }`}
                                            >
                                                {columnTasks.map((task, index) => renderTaskCard(task, index, false))}
                                                {provided.placeholder}

                                                {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                                                    <div className="h-20 sm:h-24 flex items-center justify-center text-[11px] text-slate-600 border border-dashed border-slate-800 rounded-lg">
                                                        No tasks
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Bottom Backlog Section */}
                <div className="w-full bg-[#0b1329]/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
                    <div className={`p-2.5 border rounded-lg mb-3 sm:mb-4 flex justify-between items-center ${BACKLOG_COLUMN.color}`}>
                        <span className="font-bold text-xs uppercase tracking-wider">{BACKLOG_COLUMN.label}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-black/40 rounded-full">
                            {backlogTasks.length}
                        </span>
                    </div>

                    <Droppable droppableId={BACKLOG_COLUMN.id}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`rounded-lg transition-colors ${snapshot.isDraggingOver ? "bg-slate-800/30 p-2" : ""
                                    }`}
                            >
                                {backlogTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {backlogTasks.map((task, index) => renderTaskCard(task, index, true))}
                                    </div>
                                ) : (
                                    <div className="h-16 sm:h-20 flex items-center justify-center text-[11px] text-slate-600 border border-dashed border-slate-800 rounded-lg">
                                        No overdue backlog tasks
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Task Details Modal */}
                <TaskDetailModal
                    isOpen={detailModalOpen}
                    onClose={() => {
                        setDetailModalOpen(false);
                        setSelectedTaskForDetail(null);
                    }}
                    task={selectedTaskForDetail}
                    isSupervisor={isSupervisor}
                    onStatusChange={(task, newStatus) => initiateStatusChange(task, newStatus)}
                />

                {/* Submit Proof Modal */}
                <SubmitProofModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    onSubmit={handleProofSubmit}
                    loading={loadingTaskId !== null}
                />
            </div>

            {/* Permission Restriction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm w-full text-center">
                        <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 sm:mb-4 text-lg">
                            ⚠️
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-2">Access Restricted</h3>
                        <p className="text-xs text-slate-400 mb-5">{modalMessage}</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0b1329] border border-rose-900/40 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm w-full text-center">
                        <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-3 sm:mb-4 text-lg sm:text-xl">
                            🗑️
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-2">Delete Task?</h3>
                        <p className="text-xs text-slate-400 mb-5">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        <div className="flex gap-2.5 sm:gap-3">
                            <button
                                disabled={isDeleting}
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setTaskToDeleteId(null);
                                }}
                                className="flex-1 py-2 px-3 sm:px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="flex-1 py-2 px-3 sm:px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DragDropContext>
    );
}