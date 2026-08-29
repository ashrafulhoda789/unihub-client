import { serverFetch } from "../core/server";

export const getResources = async (email) => {
    const queryParam = email ? `?email=${encodeURIComponent(email)}` : '';
    return await serverFetch(`/api/curriculum-resources${queryParam}`);
};

export const getPublicCurriculum = async (department = 'CSE', semester = 'All', search = '') => {
    const params = new URLSearchParams();

    if (department && department !== 'All') params.append('department', department);
    if (semester && semester !== 'All') params.append('semester', semester);
    if (search && search.trim() !== '') params.append('search', search);

    const queryString = params.toString();
    const endpoint = `/api/curriculum-resources${queryString ? `?${queryString}` : ''}`;

    return await serverFetch(endpoint);
};

export const getSingleCurriculum = async (id) => {
    return await serverFetch(`/api/curriculum-resources/${id}`);
};