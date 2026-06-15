'use client';

import { useLearningPathsInfoQuery } from '@/app/errors/studentApi';
import { setLearningPaths } from '@/app/store/learningPathSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { useEffect, useState } from 'react';

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    careers: number[];
    courses: number[]; // Course IDs
    duration: number; // Total duration in hours
    totalPrice: number;
    totalEnrolled: number;
}

// Helper function to check if store data is valid
const isValidLearningPathsData = (learningPaths: LearningPath[]): boolean => {
    return Array.isArray(learningPaths) && learningPaths.length > 0;
};

export function useLearningPathsData() {
    const dispatch = useAppDispatch();
    const storedLearningPaths = useAppSelector(
        (state) => state.learningPathsStore?.learningPaths || []
    );

    const [processedLearningPaths, setProcessedLearningPaths] = useState<LearningPath[]>([]);
    const [shouldSkipQuery, setShouldSkipQuery] = useState(false);

    // Check if we have valid data in store first
    useEffect(() => {
        if (storedLearningPaths && isValidLearningPathsData(storedLearningPaths)) {
            console.log('Using learning paths data from Redux store:', storedLearningPaths);
            setProcessedLearningPaths(storedLearningPaths);
            setShouldSkipQuery(true);
        } else {
            console.log('No valid learning paths data in store, will fetch from API');
            setShouldSkipQuery(false);
        }
    }, [storedLearningPaths]);

    const {
        data: apiResponse,
        error: errors,
        isLoading: isLoadings,
    } = useLearningPathsInfoQuery(
        {},
        {
            skip: shouldSkipQuery, // Skip if we have store data
        }
    );

    // Process data when API response changes
    useEffect(() => {
        const processLearningPaths = () => {
            console.log('Learning Paths API Response:', apiResponse);

            if (apiResponse?.success && apiResponse.data) {
                console.log('Using API learning paths data', apiResponse.data);

                // Ensure the data matches our interface
                const validatedData: LearningPath[] = apiResponse.data.map((item: any) => ({
                    id: item.id?.toString() || '',
                    title: item.title || '',
                    description: item.description || '',
                    careers: Array.isArray(item.careers) ? item.careers : [],
                    courses: Array.isArray(item.courses) ? item.courses : [],
                    duration: typeof item.duration === 'number' ? item.duration : 0,
                    totalPrice: typeof item.totalPrice === 'number' ? item.totalPrice : 0,
                    totalEnrolled: typeof item.totalEnrolled === 'number' ? item.totalEnrolled : 0,
                }));

                // Store the processed data in Redux store for future use
                dispatch(setLearningPaths(validatedData));
                setProcessedLearningPaths(validatedData);
                console.log('Learning paths data stored in Redux store');
            }
        };

        // Only process if we got API response and we're not using store data
        if (!shouldSkipQuery) {
            processLearningPaths();
        }
    }, [apiResponse, isLoadings, shouldSkipQuery, dispatch]);

    // Determine final learning paths to return
    const finalLearningPaths =
        processedLearningPaths.length > 0 ? processedLearningPaths : storedLearningPaths;

    console.log('Final Learning Paths Data:', finalLearningPaths);

    return {
        learningPaths: finalLearningPaths,
        errors,
        isLoadings:
            (isLoadings && !shouldSkipQuery) ||
            (!processedLearningPaths.length && !shouldSkipQuery && !storedLearningPaths.length),
        fromStore: shouldSkipQuery, // Indicates if data came from store
    };
}
