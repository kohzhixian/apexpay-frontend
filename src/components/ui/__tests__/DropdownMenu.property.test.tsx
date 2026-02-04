import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { DropdownMenu } from '../DropdownMenu';
import type { DropdownMenuItem } from '../DropdownMenu';

/**
 * Property-based tests for DropdownMenu component
 *
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
 * - Property 4: DropdownMenu toggle behavior
 * - Property 5: DropdownMenu renders items correctly
 * - Property 6: DropdownMenu click-outside closes menu
 * - Property 7: DropdownMenu item click behavior
 * - Property 8: DropdownMenu keyboard navigation
 *
 * Feature: codebase-improvements
 */

// Valid alignment options
const validAlignments = ['left', 'right'] as const;

// Valid width options
const validWidths = ['auto', 'sm', 'md'] as const;

// Custom generators

// Generate valid labels (alphanumeric with spaces)
const labelArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

// Generate optional icon names (material icon names)
const iconArbitrary = fc.constantFrom(
    'edit',
    'delete',
    'visibility',
    'settings',
    'more_vert',
    'add',
    'remove',
    'check',
    undefined
);

// Generate a single menu item
const menuItemArbitrary = (index: number): fc.Arbitrary<DropdownMenuItem> =>
    fc.record({
        id: fc.constant(`item-${index}`),
        label: labelArbitrary,
        icon: iconArbitrary,
        onClick: fc.constant(vi.fn()),
        disabled: fc.boolean(),
        destructive: fc.boolean(),
    });

// Generate a list of menu items (1 to 8 items)
const menuItemsArbitrary = fc
    .integer({ min: 1, max: 8 })
    .chain((count) =>
        fc.tuple(...Array.from({ length: count }, (_, i) => menuItemArbitrary(i)))
    );

// Generate valid divider positions based on item count
const dividerPositionsArbitrary = (itemCount: number): fc.Arbitrary<number[]> => {
    if (itemCount <= 1) return fc.constant([]);
    // Generate subset of valid indices (0 to itemCount-2, since divider after last item is pointless)
    return fc.subarray(
        Array.from({ length: itemCount - 1 }, (_, i) => i),
        { minLength: 0, maxLength: Math.min(3, itemCount - 1) }
    );
};

// Generate alignment
const alignArbitrary = fc.constantFrom(...validAlignments);

// Generate width
const widthArbitrary = fc.constantFrom(...validWidths);

// Generate trigger label
const triggerLabelArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

describe('DropdownMenu Property Tests', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    // Feature: codebase-improvements, Property 4: DropdownMenu toggle behavior
    describe('Property 4: DropdownMenu toggle behavior', () => {
        /**
         * **Validates: Requirements 4.1**
         *
         * For any DropdownMenu instance, clicking the trigger button SHALL toggle
         * the menu visibility state (closed → open, open → closed).
         */
        it('should toggle menu visibility when trigger is clicked', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Initially menu should be closed
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');

                    // Click to open
                    fireEvent.click(trigger);

                    // Menu should now be open
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'true');

                    // Click again to close
                    fireEvent.click(trigger);

                    // Menu should be closed again
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should maintain correct aria-expanded state through multiple toggles', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    fc.integer({ min: 2, max: 6 }),
                    async (items, toggleCount) => {
                        cleanup();
                        render(<DropdownMenu items={items} />);

                        const trigger = screen.getByTestId('dropdown-trigger');

                        // Toggle multiple times and verify state
                        for (let i = 0; i < toggleCount; i++) {
                            const expectedOpen = i % 2 === 0;

                            // Before click, verify current state
                            if (expectedOpen) {
                                expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                            } else {
                                expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                            }

                            fireEvent.click(trigger);

                            // After click, verify toggled state
                            if (expectedOpen) {
                                expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                                expect(trigger).toHaveAttribute('aria-expanded', 'true');
                            } else {
                                expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                                expect(trigger).toHaveAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should have correct aria attributes on trigger button', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    triggerLabelArbitrary,
                    async (items, triggerLabel) => {
                        cleanup();
                        render(<DropdownMenu items={items} triggerLabel={triggerLabel} />);

                        const trigger = screen.getByTestId('dropdown-trigger');

                        // Verify aria attributes
                        expect(trigger).toHaveAttribute('aria-label', triggerLabel);
                        expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
                        expect(trigger).toHaveAttribute('aria-expanded');
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 5: DropdownMenu renders items correctly
    describe('Property 5: DropdownMenu renders items correctly', () => {
        /**
         * **Validates: Requirements 4.2, 4.4**
         *
         * For any list of menu items with optional divider positions, when the menu is open,
         * all items SHALL be rendered with their icons and labels, and dividers SHALL appear
         * at specified positions.
         */
        it('should render all menu items with correct labels when open', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));

                    // Verify all items are rendered
                    items.forEach((item) => {
                        const menuItem = screen.getByTestId(`dropdown-item-${item.id}`);
                        expect(menuItem).toBeInTheDocument();
                        expect(menuItem.textContent).toContain(item.label.trim());
                    });
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render icons for items that have them', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));

                    // Verify icons are rendered for items that have them
                    items.forEach((item) => {
                        const menuItem = screen.getByTestId(`dropdown-item-${item.id}`);
                        if (item.icon) {
                            // Icon should be present in the button
                            const iconSpan = menuItem.querySelector('.material-symbols-outlined');
                            expect(iconSpan).toBeInTheDocument();
                            expect(iconSpan?.textContent).toBe(item.icon);
                        }
                    });
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render dividers at specified positions', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary.chain((items) =>
                        fc.tuple(fc.constant(items), dividerPositionsArbitrary(items.length))
                    ),
                    async ([items, dividerAfter]) => {
                        cleanup();
                        render(<DropdownMenu items={items} dividerAfter={dividerAfter} />);

                        // Open the menu
                        fireEvent.click(screen.getByTestId('dropdown-trigger'));

                        // Count dividers
                        const dividers = screen.queryAllByTestId('dropdown-divider');

                        // Number of dividers should match dividerAfter length
                        expect(dividers).toHaveLength(dividerAfter.length);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply correct styling for destructive items', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));

                    // Verify destructive items have correct styling
                    items.forEach((item) => {
                        const menuItem = screen.getByTestId(`dropdown-item-${item.id}`);
                        if (item.destructive) {
                            expect(menuItem.className).toContain('text-rose-400');
                        } else {
                            expect(menuItem.className).toContain('text-slate-300');
                        }
                    });
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply correct styling for disabled items', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));

                    // Verify disabled items have correct styling and attribute
                    items.forEach((item) => {
                        const menuItem = screen.getByTestId(`dropdown-item-${item.id}`);
                        if (item.disabled) {
                            expect(menuItem).toBeDisabled();
                            expect(menuItem.className).toContain('opacity-50');
                            expect(menuItem.className).toContain('cursor-not-allowed');
                        }
                    });
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply correct alignment class', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    alignArbitrary,
                    async (items, align) => {
                        cleanup();
                        render(<DropdownMenu items={items} align={align} />);

                        // Open the menu
                        fireEvent.click(screen.getByTestId('dropdown-trigger'));

                        const menuContent = screen.getByTestId('dropdown-menu-content');

                        // Verify alignment class
                        if (align === 'left') {
                            expect(menuContent.className).toContain('left-0');
                        } else {
                            expect(menuContent.className).toContain('right-0');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply correct width class', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    widthArbitrary,
                    async (items, width) => {
                        cleanup();
                        render(<DropdownMenu items={items} width={width} />);

                        // Open the menu
                        fireEvent.click(screen.getByTestId('dropdown-trigger'));

                        const menuContent = screen.getByTestId('dropdown-menu-content');

                        // Verify width class
                        if (width === 'auto') {
                            expect(menuContent.className).toContain('w-auto');
                        } else if (width === 'sm') {
                            expect(menuContent.className).toContain('w-32');
                        } else {
                            expect(menuContent.className).toContain('w-40');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 6: DropdownMenu click-outside closes menu
    describe('Property 6: DropdownMenu click-outside closes menu', () => {
        /**
         * **Validates: Requirements 4.3**
         *
         * For any open DropdownMenu, clicking outside the menu container SHALL close the menu.
         */
        it('should close menu when clicking outside', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();

                    // Create a container with an outside element
                    render(
                        <div>
                            <div data-testid="outside-element">Outside</div>
                            <DropdownMenu items={items} />
                        </div>
                    );

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Open the menu
                    fireEvent.click(trigger);
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                    // Click outside the menu (on the outside element)
                    const outsideElement = screen.getByTestId('outside-element');
                    fireEvent.mouseDown(outsideElement);

                    // Menu should be closed
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not close menu when clicking inside the menu container', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Open the menu
                    fireEvent.click(trigger);
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                    // Click on the menu content (but not on an item)
                    const menuContent = screen.getByTestId('dropdown-menu-content');
                    fireEvent.mouseDown(menuContent);

                    // Menu should still be open
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                }),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 7: DropdownMenu item click behavior
    describe('Property 7: DropdownMenu item click behavior', () => {
        /**
         * **Validates: Requirements 4.5**
         *
         * For any menu item click, the item's onClick handler SHALL be called exactly once
         * and the menu SHALL close.
         */
        it('should call onClick handler exactly once when item is clicked', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    async (items) => {
                        cleanup();
                        vi.clearAllMocks();

                        // Create fresh mock functions for this test
                        const itemsWithMocks = items.map((item) => ({
                            ...item,
                            onClick: vi.fn(),
                            disabled: false, // Ensure items are not disabled for this test
                        }));

                        render(<DropdownMenu items={itemsWithMocks} />);

                        // Open the menu
                        fireEvent.click(screen.getByTestId('dropdown-trigger'));

                        // Click on the first item
                        const firstItem = screen.getByTestId(`dropdown-item-${itemsWithMocks[0].id}`);
                        fireEvent.click(firstItem);

                        // Verify onClick was called exactly once
                        expect(itemsWithMocks[0].onClick).toHaveBeenCalledTimes(1);

                        // Verify other items' onClick handlers were not called
                        itemsWithMocks.slice(1).forEach((item) => {
                            expect(item.onClick).not.toHaveBeenCalled();
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should close menu after item click', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();

                    // Ensure at least one non-disabled item
                    const itemsWithEnabled = items.map((item, index) => ({
                        ...item,
                        disabled: index === 0 ? false : item.disabled,
                    }));

                    render(<DropdownMenu items={itemsWithEnabled} />);

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Open the menu
                    fireEvent.click(trigger);
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                    // Click on the first (non-disabled) item
                    const firstItem = screen.getByTestId(`dropdown-item-${itemsWithEnabled[0].id}`);
                    fireEvent.click(firstItem);

                    // Menu should be closed
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not call onClick handler for disabled items', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    vi.clearAllMocks();

                    // Create items with first item disabled
                    const itemsWithDisabled = items.map((item, index) => ({
                        ...item,
                        onClick: vi.fn(),
                        disabled: index === 0, // First item is disabled
                    }));

                    render(<DropdownMenu items={itemsWithDisabled} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));

                    // Try to click on the disabled item
                    const disabledItem = screen.getByTestId(`dropdown-item-${itemsWithDisabled[0].id}`);
                    fireEvent.click(disabledItem);

                    // Verify onClick was NOT called for disabled item
                    expect(itemsWithDisabled[0].onClick).not.toHaveBeenCalled();
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not close menu when clicking disabled item', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();

                    // Create items with first item disabled
                    const itemsWithDisabled = items.map((item, index) => ({
                        ...item,
                        disabled: index === 0, // First item is disabled
                    }));

                    render(<DropdownMenu items={itemsWithDisabled} />);

                    // Open the menu
                    fireEvent.click(screen.getByTestId('dropdown-trigger'));
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                    // Try to click on the disabled item
                    const disabledItem = screen.getByTestId(`dropdown-item-${itemsWithDisabled[0].id}`);
                    fireEvent.click(disabledItem);

                    // Menu should still be open (disabled items don't close menu)
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                }),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 8: DropdownMenu keyboard navigation
    describe('Property 8: DropdownMenu keyboard navigation', () => {
        /**
         * **Validates: Requirements 4.6**
         *
         * For any open DropdownMenu, pressing the Escape key SHALL close the menu.
         */
        it('should close menu when Escape key is pressed', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Open the menu
                    fireEvent.click(trigger);
                    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                    // Press Escape key
                    fireEvent.keyDown(document, { key: 'Escape' });

                    // Menu should be closed
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not respond to Escape when menu is already closed', async () => {
            await fc.assert(
                fc.asyncProperty(menuItemsArbitrary, async (items) => {
                    cleanup();
                    render(<DropdownMenu items={items} />);

                    const trigger = screen.getByTestId('dropdown-trigger');

                    // Menu starts closed
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();

                    // Press Escape key
                    fireEvent.keyDown(document, { key: 'Escape' });

                    // Menu should still be closed (no error, no state change)
                    expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                    expect(trigger).toHaveAttribute('aria-expanded', 'false');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not close menu for other key presses', async () => {
            const otherKeys = ['Enter', 'Tab', 'ArrowDown', 'ArrowUp', 'Space', 'a', '1'];

            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    fc.constantFrom(...otherKeys),
                    async (items, key) => {
                        cleanup();
                        render(<DropdownMenu items={items} />);

                        // Open the menu
                        fireEvent.click(screen.getByTestId('dropdown-trigger'));
                        expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                        // Press a non-Escape key
                        fireEvent.keyDown(document, { key });

                        // Menu should still be open
                        expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should handle multiple Escape presses gracefully', async () => {
            await fc.assert(
                fc.asyncProperty(
                    menuItemsArbitrary,
                    fc.integer({ min: 1, max: 5 }),
                    async (items, escapeCount) => {
                        cleanup();
                        render(<DropdownMenu items={items} />);

                        const trigger = screen.getByTestId('dropdown-trigger');

                        // Open the menu
                        fireEvent.click(trigger);
                        expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();

                        // Press Escape multiple times
                        for (let i = 0; i < escapeCount; i++) {
                            fireEvent.keyDown(document, { key: 'Escape' });
                        }

                        // Menu should be closed (and stay closed)
                        expect(screen.queryByTestId('dropdown-menu-content')).not.toBeInTheDocument();
                        expect(trigger).toHaveAttribute('aria-expanded', 'false');
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });
});
