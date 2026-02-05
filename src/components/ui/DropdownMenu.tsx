import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * DropdownMenu Component
 *
 * A reusable dropdown menu for contextual actions on cards and list items.
 * Supports icons, dividers, keyboard navigation, and click-outside detection.
 *
 * @example
 * // Basic usage with default trigger
 * <DropdownMenu
 *   items={[
 *     { id: 'edit', label: 'Edit', icon: 'edit', onClick: handleEdit },
 *     { id: 'delete', label: 'Delete', icon: 'delete', onClick: handleDelete, destructive: true },
 *   ]}
 * />
 *
 * // With custom trigger and dividers
 * <DropdownMenu
 *   trigger={<span>Options</span>}
 *   triggerLabel="Open options menu"
 *   items={[
 *     { id: 'view', label: 'View', icon: 'visibility', onClick: handleView },
 *     { id: 'edit', label: 'Edit', icon: 'edit', onClick: handleEdit },
 *     { id: 'delete', label: 'Delete', icon: 'delete', onClick: handleDelete, destructive: true },
 *   ]}
 *   dividerAfter={[1]}
 *   align="right"
 *   width="md"
 * />
 */

export interface DropdownMenuItem {
    /** Unique item ID */
    id: string;
    /** Item label */
    label: string;
    /** Material icon name */
    icon?: string;
    /** Click handler */
    onClick: () => void;
    /** Whether item is disabled */
    disabled?: boolean;
    /** Whether item is destructive (red styling) */
    destructive?: boolean;
}

export interface DropdownMenuProps {
    /** Menu items to display */
    items: DropdownMenuItem[];
    /** Optional divider positions (indices after which to show divider) */
    dividerAfter?: number[];
    /** Trigger button content (defaults to more_vert icon) */
    trigger?: React.ReactNode;
    /** Trigger button aria-label */
    triggerLabel?: string;
    /** Menu alignment */
    align?: 'left' | 'right';
    /** Menu width */
    width?: 'auto' | 'sm' | 'md';
}

/**
 * Width styles for the dropdown menu
 */
const widthStyles = {
    auto: 'w-auto min-w-[120px]',
    sm: 'w-32',
    md: 'w-40',
};

/**
 * Alignment styles for the dropdown menu
 */
const alignStyles = {
    left: 'left-0',
    right: 'right-0',
};

/**
 * A reusable dropdown menu component for contextual actions.
 * Features click-outside detection and keyboard navigation (Escape to close).
 *
 * @param items - Menu items to display
 * @param dividerAfter - Optional array of indices after which to show dividers
 * @param trigger - Custom trigger button content (defaults to more_vert icon)
 * @param triggerLabel - Aria-label for the trigger button
 * @param align - Menu alignment relative to trigger ('left' or 'right', default: 'right')
 * @param width - Menu width ('auto', 'sm', or 'md', default: 'auto')
 * @returns A dropdown menu component
 */
export const DropdownMenu = ({
    items,
    dividerAfter = [],
    trigger,
    triggerLabel = 'Open menu',
    align = 'right',
    width = 'auto',
}: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /**
     * Toggles menu visibility
     */
    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    /**
     * Closes the menu
     */
    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    /**
     * Handles menu item click - calls the item's onClick handler and closes the menu
     */
    const handleItemClick = useCallback((item: DropdownMenuItem) => {
        if (item.disabled) return;
        item.onClick();
        closeMenu();
    }, [closeMenu]);

    /**
     * Handles click outside to close menu
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeMenu]);

    /**
     * Handles keyboard navigation - Escape to close
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeMenu]);

    /**
     * Checks if a divider should appear after the given index
     */
    const shouldShowDivider = (index: number): boolean => {
        return dividerAfter.includes(index);
    };

    return (
        <div className="relative" ref={menuRef} data-testid="dropdown-menu">
            {/* Trigger Button */}
            <button
                onClick={handleToggle}
                className="text-slate-500 hover:text-white transition-colors p-1"
                aria-label={triggerLabel}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                data-testid="dropdown-trigger"
            >
                {trigger ?? (
                    <span className="material-symbols-outlined">more_vert</span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute ${alignStyles[align]} top-full mt-1 ${widthStyles[width]} bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden`}
                    role="menu"
                    data-testid="dropdown-menu-content"
                >
                    {items.map((item, index) => (
                        <div key={item.id}>
                            <button
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2
                                    ${item.destructive
                                        ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }
                                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                role="menuitem"
                                data-testid={`dropdown-item-${item.id}`}
                            >
                                {item.icon && (
                                    <span className="material-symbols-outlined text-[18px]">
                                        {item.icon}
                                    </span>
                                )}
                                {item.label}
                            </button>
                            {shouldShowDivider(index) && (
                                <div
                                    className="border-t border-white/10"
                                    data-testid="dropdown-divider"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
