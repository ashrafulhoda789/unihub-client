import { serverFetch } from "../core/server";

export const getResources = async (email, department = 'CSE', semester = 'All', search = '', page = 1, limit = 6) => {
    const params = new URLSearchParams({
        email,
        department,
        semester,
        q: search,
        page: page.toString(),
        limit: limit.toString()
    });

    return await serverFetch(`/api/curriculum-resources?${params.toString()}`);
};

export const getPublicCurriculum = async (
    department = 'CSE',
    semester = 'All',
    search = '',
    page = 1,
    limit = 6
) => {
    const params = new URLSearchParams();

    if (department && department !== 'All') params.append('department', department);
    if (semester && semester !== 'All') params.append('semester', semester);
    if (search && search.trim() !== '') params.append('search', search);

    // Pagination parameters
    params.append('page', page);
    params.append('limit', limit);

    const queryString = params.toString();
    const endpoint = `/api/curriculum-resources${queryString ? `?${queryString}` : ''}`;

    return await serverFetch(endpoint);
};

export const getSingleCurriculum = async (id) => {
    return await serverFetch(`/api/curriculum-resources/${id}`);
};