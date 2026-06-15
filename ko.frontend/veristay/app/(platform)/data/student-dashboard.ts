'use client';

import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { StudentDashboardData } from '../../../types/dashboard';
import { useStudentDashboardDataQuery } from '@/app/errors/studentApi';
import { useEffect, useState } from 'react';
import { setDashboardData } from '@/app/store/studentStore/studentDashboardSlice';

// Helper function to check if store data is empty or invalid
const isValidDashboardData = (data: StudentDashboardData): boolean => {
    return data && Object.keys(data).length > 0 && data.stats !== undefined;
};

export function useStudentDashboardData() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const storeDashboardData = useAppSelector(
        (state) => state.studentDashboardDataStore?.dashboardData
    );

    const [processedData, setProcessedData] = useState<StudentDashboardData | null>(null);
    const [shouldSkipQuery, setShouldSkipQuery] = useState(false);

    // Check if we have valid data in store first
    useEffect(() => {
        if (storeDashboardData && isValidDashboardData(storeDashboardData)) {
            console.log('Using dashboard data from Redux store:', storeDashboardData);
            setProcessedData(storeDashboardData);
            setShouldSkipQuery(true);
        } else {
            console.log('No valid data in store, will fetch from API');
            setShouldSkipQuery(false);
        }
    }, [storeDashboardData]);

    const {
        data: apiResponse,
        error,
        isLoading,
        isFetching,
    } = useStudentDashboardDataQuery(userId, {
        skip: !userId || shouldSkipQuery, // Skip if no userId or if we decided to skip query
    });

    // Process data when API response changes
    useEffect(() => {
        const processData = async () => {
            console.log('Student Dashboard API Response:', apiResponse);

            // Start with fallback data
            const dashboardData: StudentDashboardData = {
                stats: {
                    enrolledCourses: {
                        count: 0,
                        label: 'Active course',
                    },
                    certifications: {
                        count: 0,
                        label: 'Active certifications',
                    },
                    achievements: {
                        count: 0,
                        label: 'Badges earned',
                    },
                },
                activeCourse: null,
                certification: null,
                upcomingAssessments: [],
                achievements: [],
            };

            if (apiResponse?.success && apiResponse.data) {
                // Process API data
                dashboardData.stats = {
                    enrolledCourses: {
                        count: apiResponse.data.enrolledCourses,
                        label:
                            apiResponse.data.enrolledCourses === 1
                                ? 'Active course'
                                : 'Active courses',
                    },
                    certifications: {
                        count: apiResponse.data.certifications,
                        label:
                            apiResponse.data.certifications === 1
                                ? 'Active certification'
                                : 'Active certifications',
                    },
                    achievements: {
                        count: apiResponse.data.achievements,
                        label: 'Badges earned',
                    },
                };

                dashboardData.activeCourse = apiResponse.data.activeCourse || null;

                // Store the processed data in Redux store for future use
                dispatch(setDashboardData(dashboardData));
                console.log('Dashboard data stored in Redux store');
            }

            setProcessedData(dashboardData);
        };

        // Only process if we got API response and we're not using store data
        if (apiResponse && !shouldSkipQuery) {
            processData();
        }
    }, [apiResponse, isLoading, shouldSkipQuery, dispatch]);

    return {
        data: processedData,
        error,
        loading: (isLoading && !shouldSkipQuery) || (!processedData && !shouldSkipQuery),
        isFetching: isFetching && !shouldSkipQuery,
        fromStore: shouldSkipQuery, // Indicates if data came from store
    };
}
