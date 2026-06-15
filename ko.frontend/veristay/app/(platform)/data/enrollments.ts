'use client';

import { useStudentEnrollmentsDataQuery } from '@/app/errors/studentApi';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { Enrollment, setEnrollments } from '@/app/store/studentStore/studentEnrollmentSlice';
import { useEffect, useState } from 'react';

// Helper function to check if store enrollments data is valid
const isValidEnrollmentsData = (enrollments: Enrollment[]): boolean => {
    return Array.isArray(enrollments) && enrollments.length > 0;
};

export function useStudentEnrollmentsData() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const storeEnrollments = useAppSelector(
        (state) => state.studentEnrollmentsStore?.enrollments || []
    );

    const [processedEnrollments, setProcessedEnrollments] = useState<Enrollment[]>([]);
    const [shouldSkipQuery, setShouldSkipQuery] = useState(false);

    // Check if we have valid data in store first
    useEffect(() => {
        if (storeEnrollments && isValidEnrollmentsData(storeEnrollments)) {
            console.log('Using enrollments data from Redux store:', storeEnrollments);
            setProcessedEnrollments(storeEnrollments);
            setShouldSkipQuery(true);
        } else {
            console.log('No valid enrollments data in store, will fetch from API');
            setShouldSkipQuery(false);
            // Clear processed enrollments if store becomes invalid
            setProcessedEnrollments([]);
        }
    }, [storeEnrollments]);

    const {
        data: apiResponse,
        error,
        isLoading,
    } = useStudentEnrollmentsDataQuery(userId, {
        skip: !userId || shouldSkipQuery, // Skip if no userId or we have store data
    });

    // Process data when API response changes
    useEffect(() => {
        // Only process if we're not using store data
        if (shouldSkipQuery) return;

        const processEnrollments = () => {
            console.log('Student Enrollments API Response:', apiResponse);

            if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
                console.log('Using API enrollments data', apiResponse.data);

                // Map the API response to match your Enrollment interface
                const enrollments: Enrollment[] = (apiResponse.data as unknown as any[]).map(
                    (item: any) => ({
                        id: item?.id?.toString?.() || '',
                        courseId: item?.courseId?.toString?.() || '',
                        studentId: item?.studentId || '',
                        enrollmentDate: item?.enrollmentDate || '',
                        startDate: item?.startDate || '',
                        endDate: item?.endDate || '',
                        progress: item?.progress ?? 0,
                        status: item?.status || 'active',
                        completedModules: item?.completedModules || [],
                        currentModule: item?.currentModule || '',
                        grades: item?.grades || [],
                        certificateId: item?.certificateId,
                    })
                );

                // Store the processed data in Redux store for future use
                dispatch(setEnrollments(enrollments));
                setProcessedEnrollments(enrollments);
                console.log('Enrollments data stored in Redux store');
            } else if (!isLoading) {
                // If loading is done but no API response or failed response, set empty array
                setProcessedEnrollments([]);
            }
        };

        processEnrollments();
    }, [apiResponse, isLoading, shouldSkipQuery, dispatch]);

    // Determine final enrollments to return
    const finalEnrollments = shouldSkipQuery ? storeEnrollments : processedEnrollments;

    return {
        enrollments: finalEnrollments,
        error,
        isLoading: isLoading && !shouldSkipQuery,
        fromStore: shouldSkipQuery, // Indicates if data came from store
    };
}

// Export for backwards compatibility if needed elsewhere
export const enrollments: Enrollment[] = [];
