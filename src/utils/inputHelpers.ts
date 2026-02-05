import type { KeyboardEvent, ClipboardEvent } from 'react';

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

/**
 * Sanitizes pasted content to remove invalid characters for positive number inputs
 * Use as onPaste handler alongside preventNegativeInput for complete validation
 * @param e - Clipboard event from the input
 */
export const sanitizePastedNumber = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Remove negative signs, plus signs, and scientific notation characters
    const sanitized = pastedText.replace(/[-+eE]/g, '');
    // Only insert if we have valid numeric content
    if (sanitized && !isNaN(Number(sanitized))) {
        document.execCommand('insertText', false, sanitized);
    }
};

/**
 * Combined handlers for positive-only number inputs
 * Spread onto input element: {...positiveNumberHandlers}
 */
export const positiveNumberHandlers = {
    onKeyDown: preventNegativeInput,
    onPaste: sanitizePastedNumber,
};
