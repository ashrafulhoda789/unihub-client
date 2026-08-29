import { serverFetch } from "../core/server";

export const getResources = async (email) => {
    const queryParam = email ? `?email=${encodeURIComponent(email)}` : '';
    return await serverFetch(`/api/curriculum-resources${queryParam}`);
};