import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrainingCentre } from '../(platform)/data';

interface TrainingCentreState {
    trainingCentres: TrainingCentre[];
    selectedCentreId: number | null;
}

const initialState: TrainingCentreState = {
    trainingCentres: [],
    selectedCentreId: null,
};

const trainingCentreSlice = createSlice({
    name: 'trainingCentres',
    initialState,
    reducers: {
        setTrainingCentres: (state, action: PayloadAction<TrainingCentre[]>) => {
            state.trainingCentres = action.payload;
        },
        clearTrainingCentres: (state) => {
            state.trainingCentres = [];
        },
        setSelectedCentreId: (state, action: PayloadAction<number>) => {
            state.selectedCentreId = action.payload;
        },
        clearSelectedCentreId: (state) => {
            state.selectedCentreId = null;
        },
    },
});

export const {
    setTrainingCentres,
    clearTrainingCentres,
    setSelectedCentreId,
    clearSelectedCentreId,
} = trainingCentreSlice.actions;

export const trainingCentreReducer = trainingCentreSlice.reducer;
