import { protectedApi } from '../../../store/api';
import type { GetUserDetailsResponse } from '../types';

/** Base path for user API endpoints */
const USER_BASE_PATH = '/user';

// Inject user endpoints into the PROTECTED API (requires auth)
export const userApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Gets the current authenticated user's details
         * User ID is extracted from the auth header by the backend
         */
        getUserDetails: builder.query<GetUserDetailsResponse, void>({
            query: () => `${USER_BASE_PATH}/me`,
            providesTags: ['User'],
        }),
    }),
});

// Export auto-generated hooks
export const { useGetUserDetailsQuery } = userApi;
