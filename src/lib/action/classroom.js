'use server';

import { serverMutation } from "../core/server";

export const addClassroomResource = async (resourceData) => {
    return await serverMutation('/api/classroom-resources', resourceData, 'POST');
};

export const updateClassroomResource = async (resourceId, payload) => {
    return await serverMutation(`/api/classroom-resources/${resourceId}`, payload, "PATCH");
};

export const deleteClassroomResource = async (resourceId) => {
    return await serverMutation(`/api/classroom-resources/${resourceId}`, {}, "DELETE");
};