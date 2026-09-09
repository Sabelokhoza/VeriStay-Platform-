import { configureStore, combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { errorApi } from '../errors/errorApi';
import { authApi } from '../errors/authApi';
import { userAuthReducer } from './useAuthSlice';
import { filesApi } from '../errors/filesApi';
import { listingsApi } from '../errors/listingsApi';

// --- Combine reducers ---
const appReducer = combineReducers({
    userAuthStore: userAuthReducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer,
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
    whitelist: ['userAuthStore'],
    blacklist: [errorApi.reducerPath, authApi.reducerPath],
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
