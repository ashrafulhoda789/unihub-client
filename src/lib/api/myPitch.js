import { serverFetch } from "../core/server";

export const getPitchForSpecificUser = async (userId) => {
    return await serverFetch(`/api/pitches/user/${userId}`, {
        cache: 'no-store',
    });
};

export const getPitchById = async (pitchId) => {
    return await serverFetch(`/api/pitches/${pitchId}`);
};