import { serverFetch } from "../core/server";

export const getClassroomResources = async (
    email,
    department = 'CSE',
    semester = 'All',
    classroomCategory = 'All',
    search = '',
    page = 1,
    limit = 6
) => {
    const params = new URLSearchParams({
        email,
        department,
        semester,
        classroomCategory,
        q: search,
        page: page.toString(),
        limit: limit.toString()
    });

    return await serverFetch(`/api/classroom-resources?${params.toString()}`);
};

// Public Classroom API (For Classroom Page view)
export const getPublicClassroomResources = async (
    department = 'CSE',
    semester = 'All',
    classroomCategory = 'mid', // 'book' | 'mid' | 'final'
    search = '',
    page = 1,
    limit = 6
) => {
    const params = new URLSearchParams();

    if (department && department !== 'All') params.append('department', department);
    if (semester && semester !== 'All') params.append('semester', semester);
    if (classroomCategory && classroomCategory !== 'All') params.append('classroomCategory', classroomCategory);
    if (search && search.trim() !== '') params.append('search', search);

    params.append('page', page);
    params.append('limit', limit);

    const queryString = params.toString();
    const endpoint = `/api/classroom-resources${queryString ? `?${queryString}` : ''}`;

    return await serverFetch(endpoint);
};

export const getSingleClassroomResource = async (id) => {
    return await serverFetch(`/api/classroom-resources/${id}`);
};