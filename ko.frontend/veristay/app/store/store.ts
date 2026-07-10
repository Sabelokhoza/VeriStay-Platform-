import { studentApi } from './../errors/studentApi';
import { trainingCenterApi } from './../errors/trainingCenterApi';
import { configureStore, combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { errorApi } from '../errors/errorApi';
import { authApi } from '../errors/authApi';
import { userAuthReducer } from './useAuthSlice';
import { coursesReducer } from './coursesSlice';
import { learningPathsReducer } from './learningPathSlice';
import { trainingCentreReducer } from './trainingCentreSlice';
import { coursesApi } from '../errors/coursesApi';
import { studentDashboardReducer } from './studentStore/studentDashboardSlice';
import { studentEnrollmentsReducer } from './studentStore/studentEnrollmentSlice';
import { filesApi } from '../errors/filesApi';
import { listingsApi } from '../errors/listingsApi';

// --- Combine reducers ---
const appReducer = combineReducers({
    userAuthStore: userAuthReducer,
    coursesStore: coursesReducer,
    learningPathsStore: learningPathsReducer,
    studentDashboardDataStore: studentDashboardReducer,
    studentEnrollmentsStore: studentEnrollmentsReducer,
    trainingCentreStore: trainingCentreReducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [trainingCenterApi.reducerPath]: trainingCenterApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer, // Add listingsApi reducer
    //todo: might need to fix this idk whats going on here
    studentsStore: studentEnrollmentsReducer, // change this, should return list of students in training center
});

// --- Handle RESET_STORE action to wipe state ---
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
    if (action.type === 'RESET_STORE') {
        // Clear persisted data and Redux state
        storage.removeItem('persist:root');
        state = undefined;
    }
    return appReducer(state, action);
};

// --- Redux Persist config ---
const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'userAuthStore',
        'coursesStore',
        'learningPathsStore',
        'trainingCentreStore',
        'studentEnrollmentsStore',
    ],
    blacklist: [
        errorApi.reducerPath,
        authApi.reducerPath,
        studentApi.reducerPath,
        trainingCenterApi.reducerPath,
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Configure store ---
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        })
            .concat(errorApi.middleware)
            .concat(authApi.middleware)
            .concat(studentApi.middleware)
            .concat(trainingCenterApi.middleware)
            .concat(coursesApi.middleware)
            .concat(filesApi.middleware)
            .concat(listingsApi.middleware),
});

// --- Persistor ---
export const persistor = persistStore(store);

// --- Types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// --- Hooks (Corrected) ---
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;