import { serverFetch } from "../core/server";

export const getWorkspaceTasks = async (workspaceId) => {
    return await serverFetch(`/api/workspaces/${workspaceId}/tasks`);
};