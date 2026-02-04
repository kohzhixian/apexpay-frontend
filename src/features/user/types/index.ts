// ============================================
// API Response Types
// ============================================

/** Response from get user details endpoint */
export interface GetUserDetailsResponse {
    userId: string;
    username: string;
}

// ============================================
// Contact Types
// ============================================

/** Contact data transfer object */
export interface ContactDto {
    contactId: string;
    username: string;
    email: string;
}

/** Request to add a new contact */
export interface AddContactRequest {
    contactEmail: string;
    walletId: string;
}

/** Response after adding a contact */
export interface AddContactResponse {
    contactId: string;
    message: string;
}

/** Response for getting all contacts */
export interface GetContactsResponse {
    contacts: ContactDto[];
}

/** Response after deleting a contact */
export interface DeleteContactResponse {
    message: string;
}
