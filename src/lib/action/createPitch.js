'use server'

import { serverMutation } from "../core/server";

export const createPitch = async (pitchData) => {
    return await serverMutation('/api/pitches', pitchData, 'POST');
};

export const finalizePitchTeam = async (pitchId) => {
    return await serverMutation(`/api/pitches/${pitchId}/finalize`, {}, 'PATCH');
};

export const handleJoinRequestAction = async (pitchId, actionPayload) => {
    return await serverMutation(`/api/pitches/${pitchId}/request-action`, actionPayload, 'PATCH');
};

export const updatePitch = async (pitchId, payload) => {
    return await serverMutation(`/api/pitches/${pitchId}`, payload, "PATCH");
};

export const deletePitch = async (pitchId) => {
    return await serverMutation(`/api/pitches/${pitchId}`, {}, "DELETE");
};