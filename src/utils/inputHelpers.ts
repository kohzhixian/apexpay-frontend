import type { KeyboardEvent } from 'react';

/**
 * Prevents invalid characters in number inputs (negative, scientific notation)
 * Use as onKeyDown handler for number inputs that should only accept positive values
 * @param e - Keyboard event from the input
 */
export const preventNegativeInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
    }
};
