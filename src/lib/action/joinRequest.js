'use server'
import { serverMutation } from "../core/server";

export const submitJoinRequest = async (pitchId, requestData) => {
    return await serverMutation(`/api/pitches/${pitchId}/join-request`, requestData);
};

export const acceptJoinRequest = async (pitchId, requestId, actionData = {}) => {
    return await serverMutation(
        `/api/pitches/${pitchId}/join-requests/${requestId}/accept`,
        actionData,
        "PATCH"
    );
};

export const deleteTeamMember = async (pitchId, memberUserId) => {
    return await serverMutation(
        `/api/pitches/${pitchId}/members/${memberUserId}`,
        {},
        "DELETE"
    );
};

export const deletePitchRequest = async (pitchId, requestId) => {
    return await serverMutation(`/api/pitches/${pitchId}/join-requests/${requestId}`, {}, 'DELETE');
};