import { publicApi, protectedApi } from '../../../store/api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LogoutResponse } from '../types';

// Inject auth endpoints into the PUBLIC API (no auth required)
export const authApi = publicApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
    }),
});

// Inject logout into PROTECTED API (requires auth)
export const authProtectedApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // Invalidate all cached data on logout
            invalidatesTags: ['User', 'Wallet', 'Transaction'],
        }),
    }),
});

// Export auto-generated hooks
export const { useLoginMutation, useRegisterMutation } = authApi;
export const { useLogoutMutation } = authProtectedApi;
