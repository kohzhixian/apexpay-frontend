import { protectedApi } from '../../../store/api';
import type {
    AddContactRequest,
    AddContactResponse,
    GetContactsResponse,
    DeleteContactResponse,
} from '../types';

/** Base path for contacts API endpoints */
const CONTACTS_BASE_PATH = '/contacts';

// Inject contacts endpoints into the PROTECTED API (requires auth)
export const contactsApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Adds a new contact for the authenticated user
         * @param body - Contact email and wallet ID
         */
        addContact: builder.mutation<AddContactResponse, AddContactRequest>({
            query: (body) => ({
                url: CONTACTS_BASE_PATH,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Contact'],
        }),

        /**
         * Gets all contacts for the authenticated user
         */
        getContacts: builder.query<GetContactsResponse, void>({
            query: () => CONTACTS_BASE_PATH,
            providesTags: ['Contact'],
        }),

        /**
         * Deletes a contact by ID
         * @param contactId - The UUID of the contact to delete
         */
        deleteContact: builder.mutation<DeleteContactResponse, string>({
            query: (contactId) => ({
                url: `${CONTACTS_BASE_PATH}/${contactId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Contact'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useAddContactMutation,
    useGetContactsQuery,
    useDeleteContactMutation,
} = contactsApi;
