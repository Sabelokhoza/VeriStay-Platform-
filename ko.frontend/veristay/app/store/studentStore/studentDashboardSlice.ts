import { StudentDashboardData } from '@/types/dashboard';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentDashboardState {
    dashboardData: StudentDashboardData;
}

const initialState: StudentDashboardState = {
    dashboardData: {} as StudentDashboardData,
};

const studentDashboardSlice = createSlice({
    name: 'studentDashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action: PayloadAction<StudentDashboardData>) => {
            state.dashboardData = action.payload;
        },
        clearDashboardData: (state) => {
            state.dashboardData = {} as StudentDashboardData;
        },
    },
});

export const { setDashboardData, clearDashboardData } = studentDashboardSlice.actions;
export const studentDashboardReducer = studentDashboardSlice.reducer;
