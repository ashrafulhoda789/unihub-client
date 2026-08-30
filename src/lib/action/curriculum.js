'use server'

import { serverMutation } from "../core/server";

export const addCurriculumResource = async (resourceData) => {
    return await serverMutation('/api/curriculum-resources', resourceData, 'POST');
};


export const updateResources = async (resourceId, payload) => {
    return await serverMutation(`/api/curriculum-resources/${resourceId}`, payload, "PATCH");
};

export const deleteResources = async (resourceId) => {
    return await serverMutation(`/api/curriculum-resources/${resourceId}`, {}, "DELETE");
};
