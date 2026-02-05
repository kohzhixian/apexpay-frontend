/**
 * Validation Schemas
 *
 * This module exports all Zod validation schemas and their corresponding
 * TypeScript types for form validation with react-hook-form.
 */

// Login form schema and types
export { loginSchema, type LoginFormData } from './loginSchema';

// Register form schema and types
export { registerSchema, type RegisterFormData } from './registerSchema';

// Top-up form schema and types
export { topUpSchema, type TopUpFormData } from './topUpSchema';

// Transfer form schema and types
export { createTransferSchema, type TransferFormData } from './transferSchema';
