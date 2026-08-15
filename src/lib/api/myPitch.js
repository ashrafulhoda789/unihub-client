import { serverFetch } from "../core/server";

export const getAllPitches = async ({ category = 'All', search = '', status = '' } = {}) => {
    const queryParams = new URLSearchParams();
    if (category && category !== 'All') queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);

    const queryString = queryParams.toString();
    return await serverFetch(`/api/pitches${queryString ? `?${queryString}` : ''}`);
};

export const getPitchForSpecificUser = async (userId) => {
    return await serverFetch(`/api/pitches/user/${userId}`, {
        cache: 'no-store',
    });
};

export const getPitchById = async (pitchId) => {
    return await serverFetch(`/api/pitches/${pitchId}`);
};