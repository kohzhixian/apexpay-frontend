import { z } from 'zod';

/**
 * Creates a transfer validation schema with dynamic balance validation
 * 
 * @param maxBalance - The maximum available balance for transfer
 * @returns Zod schema for transfer form validation
 */
export const createTransferSchema = (maxBalance: number) =>
    z.object({
        recipient: z
            .string()
            .min(1, 'Recipient email is required')
            .email('Please enter a valid email address'),
        amount: z
            .string()
            .min(1, 'Amount is required')
            .refine(
                (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
                'Amount must be greater than 0'
            )
            .refine(
                (val) => {
                    const num = parseFloat(val);
                    return Number.isFinite(num) && num <= maxBalance;
                },
                `Amount cannot exceed available balance of ${maxBalance.toFixed(2)}`
            ),
        note: z
            .string()
            .max(200, 'Note must not exceed 200 characters')
            .optional()
            .or(z.literal('')),
    });

export type TransferFormData = z.infer<ReturnType<typeof createTransferSchema>>;
