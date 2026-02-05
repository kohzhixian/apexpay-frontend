import { z } from 'zod';

export const topUpSchema = z.object({
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
                return Number.isFinite(num) && /^\d+(\.\d{1,2})?$/.test(val);
            },
            'Amount must have at most 2 decimal places'
        ),
    currency: z.string().min(1, 'Currency is required'),
    paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export type TopUpFormData = z.infer<typeof topUpSchema>;
