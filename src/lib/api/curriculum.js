import { serverFetch } from "../core/server";

export const getResources = async (email) => {
    const queryParam = email ? `?email=${encodeURIComponent(email)}` : '';
    return await serverFetch(`/api/curriculum-resources${queryParam}`);
};

export const getPublicCurriculum = async (department = 'CSE', semester = 'All') => {
    let query = `?department=${department}`;
    if (semester !== 'All') {
        query += `&semester=${semester}`;
    }
    return await serverFetch(`/api/curriculum-resources${query}`);
};

export const getSingleCurriculum = async (id) => {
    return await serverFetch(`/api/curriculum-resources/${id}`);
};