import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Enrollment {
    id: string;
    courseId: number;
    studentId: string;
    enrollmentDate: string;
    startDate: string;
    endDate: string;
    progress: number;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    completedModules: number[];
    currentModule: number;
    grades: {
        moduleId: number;
        grade: number;
        feedback: string;
    }[];
    certificateId?: string;
}

interface StudentEnrollmentsState {
    enrollments: Enrollment[];
}

const initialState: StudentEnrollmentsState = {
    enrollments: [],
};

const studentEnrollmentsSlice = createSlice({
    name: 'studentEnrollments',
    initialState,
    reducers: {
        setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
            state.enrollments = action.payload;
        },
        clearEnrollments: (state) => {
            state.enrollments = [];
        },
        updateEnrollment: (state, action: PayloadAction<Enrollment>) => {
            const index = state.enrollments.findIndex(
                (enrollment) => enrollment.id === action.payload.id
            );
            if (index !== -1) {
                state.enrollments[index] = action.payload;
            }
        },
    },
});

export const { setEnrollments, clearEnrollments, updateEnrollment } =
    studentEnrollmentsSlice.actions;
export const studentEnrollmentsReducer = studentEnrollmentsSlice.reducer;
