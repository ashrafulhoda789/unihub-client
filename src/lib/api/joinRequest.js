import { serverFetch } from "../core/server";

export const getPitchJoinRequests = async (pitchId, status = '') => {
    const query = status ? `?status=${status}` : '';
    return await serverFetch(`/api/pitches/${pitchId}/join-requests${query}`, {
        cache: 'no-store',
    });
};


export const getUserJoinRequests = async (userId) => {
    return await serverFetch(`/api/pitches/join-requests/user/${userId}`, {
        cache: 'no-store',
    });
};

export const getOwnerIncomingRequests = async (ownerId, status = '') => {
    const query = status ? `?status=${status}` : '';
    return await serverFetch(`/api/pitches/owner/${ownerId}/join-requests${query}`, {
        cache: 'no-store',
    });
};