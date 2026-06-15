// store/slices/coursesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../(platform)/data/courses';

interface CoursesState {
    courses: Course[];
}

const initialState: CoursesState = {
    courses: [],
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses = action.payload;
        },
        clearCourses: (state) => {
            state.courses = [];
        },
    },
});

export const { setCourses, clearCourses } = coursesSlice.actions;
export const coursesReducer = coursesSlice.reducer;
