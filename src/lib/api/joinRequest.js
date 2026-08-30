import { serverFetch } from "../core/server";

export const getPitchJoinRequests = async (pitchId, status = '') => {
    const query = status ? `?status=${status}` : '';
    return await serverFetch(`/api/pitches/${pitchId}/join-requests${query}`, {
        cache: 'no-store',
    });
};

export const getUserJoinRequests = async (userId, { q = '', status = 'ALL', category = 'ALL', page = 1, limit = 6 } = {}) => {
    const params = new URLSearchParams({
        q,
        status,
        category,
        page: page.toString(),
        limit: limit.toString()
    });

    return await serverFetch(`/api/pitches/join-requests/user/${userId}?${params.toString()}`);
};

export const getOwnerIncomingRequests = async (ownerId, status = '') => {
    const query = status ? `?status=${status}` : '';
    return await serverFetch(`/api/pitches/owner/${ownerId}/join-requests${query}`, {
        cache: 'no-store',
    });
};