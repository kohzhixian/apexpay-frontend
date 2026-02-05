/** Payload for user login */
export interface LoginRequest {
    email: string;
    password: string;
}

/** Payload for user registration */
export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

// Response types

/** Response from login endpoint */
export interface LoginResponse {
    message: string;
}

/** Response from register endpoint */
export interface RegisterResponse {
    message: string;
}

/** Response from logout endpoint */
export interface LogoutResponse {
    message: string;
}

/** Response from refresh token endpoint */
export interface RefreshResponse {
    message: string;
}
