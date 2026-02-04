import { configureStore } from '@reduxjs/toolkit';
import { publicApi, protectedApi } from './api';

export const store = configureStore({
    reducer: {
        [publicApi.reducerPath]: publicApi.reducer,
        [protectedApi.reducerPath]: protectedApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(publicApi.middleware)
            .concat(protectedApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
