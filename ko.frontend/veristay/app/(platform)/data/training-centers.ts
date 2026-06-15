import { useGetAllTrainingCentresQuery } from '@/app/errors/trainingCenterApi';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setTrainingCentres } from '@/app/store/trainingCentreSlice';

import { useEffect } from 'react';

export interface TrainingCentre {
    id: string;
    name: string;
    location: string;
    address: string;
    contactNumber: string;
    email: string;
    rating: number;
    reviews: number;
}

// Fallback data for when API is not available
const fallbackTrainingCentres: TrainingCentre[] = [];

export function useTrainingCentresData() {
    const dispatch = useAppDispatch();
    const storedTrainingCentres = useAppSelector(
        (state) => state.trainingCentreStore.trainingCentres
    );

    const { data: apiResponse, error, isLoading } = useGetAllTrainingCentresQuery({});

    console.log('Training Centres API Response:', apiResponse);

    // Save to Redux when API data is available
    useEffect(() => {
        if (apiResponse?.success && apiResponse.data) {
            console.log('Saving API training centres data to Redux', apiResponse.data);
            // Map the API response to match your TrainingCentre interface
            const mappedData = apiResponse.data.map((item: any) => ({
                id: item.id?.toString() || '',
                name: item.name || '',
                location: item.location || '',
                address: item.address || '',
                contactNumber: item.contactPhone || '',
                email: item.contactEmail || '',
                rating: item.rating || 0,
                reviews: item.reviews || 0,
            }));

            dispatch(setTrainingCentres(mappedData));
        }
    }, [apiResponse, dispatch]);

    // Start with stored data or fallback
    let trainingCentres: TrainingCentre[] =
        storedTrainingCentres.length > 0 ? storedTrainingCentres : fallbackTrainingCentres;

    // Override with fresh API data if available
    if (apiResponse?.success && apiResponse.data) {
        console.log('Using fresh API training centres data', apiResponse.data);
        trainingCentres =
            apiResponse.data.map((item: any) => ({
                id: item.id?.toString() || '',
                name: item.name || '',
                location: item.location || '',
                address: item.address || '',
                contactNumber: item.contactNumber || '',
                email: item.email || '',
                rating: item.rating || 0,
                reviews: item.reviews || 0,
            })) || trainingCentres;
    }

    return {
        trainingCentres,
        error,
        isLoading,
    };
}
