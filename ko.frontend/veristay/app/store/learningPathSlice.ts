import { LearningPath } from './../(platform)/data/learning-paths';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LearningPathsState {
    learningPaths: LearningPath[];
}

const initialState: LearningPathsState = {
    learningPaths: [],
};

const learningPathsSlice = createSlice({
    name: 'learningPaths',
    initialState,
    reducers: {
        setLearningPaths: (state, action: PayloadAction<LearningPath[]>) => {
            state.learningPaths = action.payload;
        },
        clearLearningPaths: (state) => {
            state.learningPaths = [];
        },
    },
});

export const { setLearningPaths, clearLearningPaths } = learningPathsSlice.actions;
export const learningPathsReducer = learningPathsSlice.reducer;
