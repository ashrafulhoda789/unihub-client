'use server'

import { serverMutation } from "../core/server";

export const createTask = async (taskData) => {
    return await serverMutation('/api/tasks', taskData);
};


export const updateTaskStatus = async (taskId, statusData) => {
    return await serverMutation(
        `/api/tasks/${taskId}/status`,
        statusData,
        "PATCH"
    );
};

export const deleteTask = async (taskId) => {
    return await serverMutation(
        `/api/tasks/${taskId}`,
        {},
        "DELETE"
    );
};