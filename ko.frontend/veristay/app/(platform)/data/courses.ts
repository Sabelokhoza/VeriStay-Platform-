'use client';

import { useStudentCoursesDataQuery } from '@/app/errors/studentApi';
import { setCourses } from '@/app/store/coursesSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { ModuleContent } from '@/components/course/partner-module-editor';
import { useEffect, useState } from 'react';

export interface Module {
    id: number;
    title: string;
    description: string;
    duration: number;
    topics: string[];
    content: ModuleContent[];
    resources?: {
        title: string;
        type: string;
        url: string;
    }[];
}

export interface Prerequisite {
    id: string;
    title: string;
    status: 'completed' | 'pending' | 'missing';
}

export interface Course {
    id: number;
    title: string;
    description: string;
    duration: number;
    students: number;
    psiraLevel: string;
    price: number;
    rating: number;
    reviews: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor: string;
    prerequisites: Prerequisite[];
    trainingCenterId: string;
    modules: Module[];
    skills: string[];
    outcomes: string[];
    status: 'draft' | 'published' | 'archived';
    certification: {
        type: string;
        validity: string;
        requirements: string[];
    };
}

export function useStudentCoursesData() {
    const dispatch = useAppDispatch();
    const storedCourses = useAppSelector((state) => state.coursesStore.courses);
    const [processedCourses, setProcessedCourses] = useState<Course[]>([]);
    const [shouldSkipQuery, setShouldSkipQuery] = useState(
        Array.isArray(storedCourses) && storedCourses.length > 0
    );

    const {
        data: apiResponse,
        error,
        isLoading,
        refetch: rtkRefetch,
    } = useStudentCoursesDataQuery({}, { skip: shouldSkipQuery });

    useEffect(() => {
        const processAndStoreCourses = async () => {
            if (apiResponse?.success && apiResponse.data) {
                const processed: Course[] = await Promise.all(
                    apiResponse.data.map(async (item: any) => ({
                        id: item.id || 0,
                        title: item.title || '',
                        description: item.description || '',
                        duration: item.duration || 0,
                        students: item.students || 0,
                        psiraLevel: item.psiraLevel || '',
                        price: parseFloat(item.price) || 0,
                        rating: item.rating || 0,
                        reviews: item.reviews || 0,
                        level: item.level || 'Beginner',
                        instructor: item.instructor || '',
                        prerequisites: item.prerequisites || [],
                        trainingCenterId: item.trainingCenterId?.toString() || '',
                        modules:
                            item.modules?.map((module: any) => ({
                                id: module.id || 0,
                                title: module.title || '',
                                description: module.description || '',
                                duration: module.duration || 0,
                                topics: module.topics || [],
                                content:
                                    module.content?.map((content: any) => ({
                                        id: content.id || 0,
                                        title: content.title || '',
                                        description: content.description || '',
                                        type: content.contentType || 'document',
                                        videoUrl: content.videoUrl || '',
                                        textContent: content.textContent || '',
                                        quizQuestions: content.quizQuestions || null,
                                        resources: content.resources || [],
                                    })) || [],
                                resources: module.resources || [],
                            })) || [],
                        skills: item.skills || [],
                        outcomes: item.outcomes || [],
                        status: item.status || 'published',
                        certification: {
                            type: item.certification?.type || '',
                            validity: item.certification?.validity || '',
                            requirements: item.certification?.requirements || [],
                        },
                    }))
                );

                dispatch(setCourses(processed));
                setProcessedCourses(processed);
                setShouldSkipQuery(true); // re-enable skip after fresh fetch
            }
        };

        processAndStoreCourses();
    }, [apiResponse, dispatch]);

    const refetch = () => {
        dispatch(setCourses([])); // clear store to invalidate cache
        setProcessedCourses([]); // clear local state
        setShouldSkipQuery(false); // unblock the query
        rtkRefetch(); // trigger RTK Query immediately
    };

    return {
        courses: processedCourses.length > 0 ? processedCourses : storedCourses,
        isLoading: isLoading && !shouldSkipQuery,
        error,
        refetch,
    };
}
