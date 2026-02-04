// App branding
export const APP_NAME = 'ApexPay';
export const APP_TAGLINE = 'Wallet Dashboard';

// Page titles
export const PAGE_TITLES = {
    DASHBOARD: 'Dashboard',
    TRANSFER: 'Transfer Funds',
    TRANSACTION_HISTORY: 'Transaction History',
    CARDS: 'Cards',
    ANALYTICS: 'Analytics',
    SETTINGS: 'Settings',
} as const;

// Dashboard
export const DASHBOARD_TEXT = {
    WELCOME_BACK: 'Welcome back',
    WELCOME_BACK_USER: (userName: string) => `Welcome back, ${userName}`,
    RECENT_TRANSACTIONS: 'Recent Transactions',
    VIEW_ALL: 'View All',
    AVAILABLE_BALANCE: 'Available Balance',
    RESERVED_BALANCE: 'Reserved Balance',
    LAST_UPDATED: 'Last updated just now',
    MENU: 'menu',
    MORE_OPTIONS: 'more_horiz',
} as const;

// Transfer page
export const TRANSFER_TEXT = {
    PAGE_TITLE: 'Transfer Funds',
    PAGE_DESCRIPTION: 'Securely send money to friends, family, or businesses instantly.',
    QUICK_TRANSFER: 'Quick Transfer',
    RECIPIENT_LABEL: 'Recipient',
    RECIPIENT_PLACEHOLDER: 'Email, ID, or Phone Number',
    AMOUNT_LABEL: 'Amount',
    AMOUNT_PLACEHOLDER: '0.00',
    NOTE_LABEL: 'Note (Optional)',
    NOTE_PLACEHOLDER: 'What is this for?',
    BALANCE_PREFIX: 'Balance',
    MAX_AMOUNT: 'Max Amount',
    TRANSFER_FEE: 'Transfer Fee',
    ARRIVAL_TIME: 'Arrival Time',
    ARRIVAL_TIME_VALUE: 'Instant',
    TOTAL_DEDUCTION: 'Total Deduction',
    SEND_TRANSFER: 'Send Transfer',
    DAILY_LIMIT: 'Daily Limit',
    DAILY_LIMIT_ACTIVE: 'Active',
    DAILY_LIMIT_USED: 'of daily limit used',
    EXCHANGE_RATES: 'Exchange Rates',
    EXCHANGE_RATES_DESC: 'View live currency rates',
    RECENT: 'Recent',
    SECURE_TRANSFER: 'Secure Transfer',
    SECURE_TRANSFER_DESC: 'Your transaction is protected by end-to-end encryption. Funds typically arrive within seconds.',
    NEW_CONTACT: 'New',
    VIEW_ALL: 'View All',
    AVAILABLE_BALANCE: 'Available Balance',
    LAST_UPDATED: 'Last updated just now',
    SEARCH_TRANSACTIONS: 'Search transactions...',
    DASHBOARD: 'Dashboard',
} as const;

// Transaction History
export const HISTORY_TEXT = {
    PAGE_TITLE: 'Transaction History',
    EXPORT_CSV: 'Export CSV',
    NEW_TRANSACTION: 'New Transaction',
    SEARCH_PLACEHOLDER: 'Search by ID or description...',
    NO_TRANSACTIONS: 'No transactions found',
    SHOWING: 'Showing',
    TO: 'to',
    OF: 'of',
    TRANSACTIONS: 'transactions',
    PREVIOUS: 'Previous',
    NEXT: 'Next',
} as const;

// Table headers
export const TABLE_HEADERS = {
    DATE: 'Date',
    TRANSACTION_ID: 'Transaction ID',
    TYPE: 'Type',
    DESCRIPTION: 'Description',
    RECIPIENT_SOURCE: 'Recipient/Source',
    AMOUNT: 'Amount',
    STATUS: 'Status',
} as const;

// Table states
export const TABLE_STATES = {
    LOADING: 'Loading transactions...',
    FAILED_TO_LOAD: 'Failed to load transactions',
    NO_TRANSACTIONS: 'No transactions yet',
    RETRY: 'Retry',
} as const;

// Table icons
export const TABLE_ICONS = {
    RECEIPT_LONG: 'receipt_long',
} as const;

// Filter options
export const FILTER_TEXT = {
    ALL_DATES: 'All Dates',
    TODAY: 'Today',
    LAST_7_DAYS: 'Last 7 Days',
    LAST_30_DAYS: 'Last 30 Days',
    LAST_90_DAYS: 'Last 90 Days',
    ALL_STATUS: 'All Status',
    ALL_TYPES: 'All Types',
} as const;

// Transaction types
export const TRANSACTION_TYPE_LABELS = {
    SUBSCRIPTION: 'Payment',
    TOP_UP: 'Top-up',
    TRANSFER: 'Transfer',
    EARNING: 'Earning',
    EXCHANGE: 'Exchange',
} as const;

// Transaction status
export const TRANSACTION_STATUS_LABELS = {
    SUCCESS: 'Success',
    PENDING: 'Pending',
    FAILED: 'Failed',
} as const;

// Modals
export const MODAL_TEXT = {
    // Top Up
    TOP_UP_TITLE: 'Top Up Balance',
    TOP_UP_SUBTITLE: 'Add funds to your secure wallet',
    ENTER_AMOUNT: 'Enter Amount',
    AMOUNT_PLACEHOLDER: '0.00',
    PAYMENT_METHOD: 'Payment Method',
    ADD_NEW: 'Add New',
    TRANSACTION_REFERENCE: 'Transaction Reference',
    REFERENCE_HELP: 'Use this reference if you need to contact support.',
    REVIEW_TRANSACTION: 'Review Transaction',
    ENCRYPTED_PAYMENT: 'End-to-End Encrypted Payment',

    // Top Up Processing
    TOP_UP_IN_PROGRESS: 'Top Up in Progress',
    PROCESSING_TRANSACTION: 'Processing Transaction...',
    TWO_PHASE_COMMIT: 'Initiating Two-Phase Commit protocol for secure transfer.',
    AES_ENCRYPTED: 'AES-256 Encrypted',
    CHASE_BANK_NAME: 'Chase Bank',
    APEXPAY_WALLET: 'ApexPay Wallet',
    PHASE_2_COMMIT: 'Phase 2: Commit',
    LOCKING_LEDGER: 'Locking Ledger Entry...',
    TRANSACTION_ID_PREFIX: 'ID: #TXN-9982-ALPHA',

    // Top Up Success
    FUNDS_ADDED: 'Funds Added Successfully',
    WALLET_TOPPED_UP: 'Your wallet has been topped up.',
    UPDATED_BALANCE: 'Updated Balance',
    TOP_UP_AMOUNT: 'Top Up Amount',
    TRANSACTION_ID: 'Transaction ID',
    VIEW_RECEIPT: 'View Receipt',
    DONE: 'Done',
    NEED_HELP: 'Need help with this transaction?',
    CONTACT_SUPPORT: 'Contact Support',
    COPY_ID_ARIA: 'Copy ID',

    // Transfer Processing
    PROCESSING_TRANSFER: 'Processing Transaction',
    PROTOCOL_ENGINE: 'Protocol Engine v4.0.2 // Dist-Ledger',
    TXID_PREFIX: 'TXID: APX-9921-X992',
    AWAITING_CONFIRMATION: 'Awaiting Network Confirmation',
    ATOMIC_SWAP: 'Atomic swap: transaction is non-reversible',
    SYNCING: 'SYNCING',
    PEER_HANDSHAKE: 'PEER_HANDSHAKE',

    // Transfer Success
    TRANSFER_SUCCESSFUL: 'Transfer Successful',
    TRANSACTION_COMPLETED: 'Transaction completed securely',
    SENT_TO: 'Sent to',
    TRANSACTION_HASH: 'Transaction Hash',
    TIMESTAMP: 'Timestamp',
    STATUS: 'Status',
    COMPLETED: 'Completed',
    BACK_TO_DASHBOARD: 'Back to Dashboard',
    DOWNLOAD_RECEIPT: 'Download Receipt',
    ENCRYPTED_TRANSACTION: 'End-to-End Encrypted Transaction',
    APEX_WALLET: (currency: string) => `Apex Wallet (${currency})`,

    // Contacts
    ALL_CONTACTS: 'All Contacts',
    SEARCH_CONTACTS: 'Search by name, email, or handle...',
    NO_CONTACTS: 'No contacts found',
    TRY_DIFFERENT_SEARCH: 'Try a different search term',
    ADD_NEW_CONTACT: 'Add New Contact',
} as const;

// Quick actions
export const QUICK_ACTIONS = {
    TOP_UP: 'Top Up',
    TRANSFER: 'Transfer',
    EXCHANGE: 'Exchange',
} as const;

// Quick action icons
export const QUICK_ACTION_ICONS = {
    TOP_UP: 'add',
    TRANSFER: 'send',
    EXCHANGE: 'currency_exchange',
    ARROW_FORWARD: 'arrow_forward',
} as const;

// Payment methods
export const PAYMENT_METHOD_TEXT = {
    VISA_ENDING: 'Visa ending in 4242',
    VISA_EXPIRES: 'Expires 09/25',
    CHASE_BANK: 'Chase Bank',
    CHASE_CHECKING: 'Checking •••• 9921',
} as const;

// Processing steps
export const PROCESSING_STEPS = {
    CONTACTING_BANK: 'Contacting Bank Gateway',
    CONTACTING_BANK_DESC: 'Handshake established with Chase API',
    CONTACTING_BANK_DURATION: '120ms',
    VERIFYING_FUNDS: 'Verifying Funds Availability',
    VERIFYING_FUNDS_DESC: 'Pre-authorization token received',
    VERIFYING_FUNDS_DURATION: '45ms',
    PREPARING_LEDGER: 'Preparing Ledger Entry',
    PREPARING_LEDGER_DESC: 'Writing to distributed node shard #4...',
    PREPARING_LEDGER_DURATION: 'PENDING',
} as const;

// Currency options
export const CURRENCIES = {
    SGD: 'SGD',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
} as const;

// Transfer Processing Steps
export const TRANSFER_PROCESSING_STEPS = [
    {
        id: '1',
        title: 'Locking Sender Funds',
        description: 'Phase 1: Preparation Complete',
        badges: ['LEDGER_OK', 'RESERVED'],
    },
    {
        id: '2',
        title: 'Verifying Recipient Ledger',
        description: 'Phase 2: Verification in progress',
        progress: 82,
    },
    {
        id: '3',
        title: 'Finalizing Atomic Swap',
        description: 'Phase 3: Commit Pending',
    },
] as const;

// Transfer Processing Log Entries
export const TRANSFER_LOG_ENTRIES = [
    {
        timestamp: '14:02:44.11',
        status: 'OK' as const,
        message: 'Two-Phase Commit protocol (2PC-DL) initiated',
    },
    {
        timestamp: '14:02:44.29',
        status: 'OK' as const,
        message: 'Signature validated (HSM_ENCLAVE)',
    },
    {
        timestamp: '14:02:44.88',
        status: 'INFO' as const,
        message: 'Querying Recipient Balance (Cluster-Delta)...',
    },
    {
        timestamp: '14:02:45.02',
        status: 'PROC' as const,
        message: 'Awaiting ACK from node [04/05]',
    },
] as const;

// Icon names
export const ICONS = {
    ADD_CARD: 'add_card',
    CLOSE: 'close',
    ADD: 'add',
    CREDIT_CARD: 'credit_card',
    ACCOUNT_BALANCE: 'account_balance',
    ACCOUNT_BALANCE_WALLET: 'account_balance_wallet',
    FINGERPRINT: 'fingerprint',
    CONTENT_COPY: 'content_copy',
    LOCK: 'lock',
    ARROW_FORWARD: 'arrow_forward',
    CHECK_CIRCLE: 'check_circle',
    ADD_CIRCLE: 'add_circle',
    PROGRESS_ACTIVITY: 'progress_activity',
    RADIO_BUTTON_UNCHECKED: 'radio_button_unchecked',
    CHECK: 'check',
    SYNC: 'sync',
    SCHEDULE: 'schedule',
    DOWNLOAD: 'download',
    SHIELD: 'shield',
    SEARCH: 'search',
    CHEVRON_LEFT: 'chevron_left',
    CHEVRON_RIGHT: 'chevron_right',
    MENU: 'menu',
    NOTIFICATIONS: 'notifications',
    HELP: 'help',
    ALTERNATE_EMAIL: 'alternate_email',
    QR_CODE_SCANNER: 'qr_code_scanner',
    EXPAND_MORE: 'expand_more',
    DESCRIPTION: 'description',
    CURRENCY_EXCHANGE: 'currency_exchange',
    SHIELD_LOCK: 'shield_lock',
} as const;

// Common UI text
export const COMMON_TEXT = {
    LOADING: 'Loading...',
    RETRY: 'Retry',
    CLOSE: 'Close',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    SAVE: 'Save',
    DELETE: 'Delete',
    EDIT: 'Edit',
    SEARCH: 'Search',
    FILTER: 'Filter',
    SORT: 'Sort',
    MORE: 'More',
} as const;

// Status messages
export const STATUS_MESSAGES = {
    LOADING_TRANSACTIONS: 'Loading transactions...',
    FAILED_TO_LOAD: 'Failed to load transactions',
    NO_TRANSACTIONS_YET: 'No transactions yet',
} as const;

// Breadcrumbs
export const BREADCRUMBS = {
    DASHBOARD: 'Dashboard',
    TRANSFER_FUNDS: 'Transfer Funds',
} as const;

// Search placeholders
export const SEARCH_PLACEHOLDERS = {
    TRANSACTIONS: 'Search transactions...',
    CONTACTS: 'Search by name, email, or handle...',
} as const;

// Wallets Page
export const WALLETS_TEXT = {
    PAGE_TITLE: 'My Wallets',
    PAGE_DESCRIPTION: 'Manage your distributed funds across multiple accounts.',
    ADD_NEW_WALLET: 'Add New Wallet',
    TOTAL_NET_WORTH: 'Total Net Worth',
    MONTHLY_GROWTH: 'Monthly Growth',
    ACTIVE_ASSETS: 'Active Assets',
    CURRENCIES_SUFFIX: 'Currencies',
    CURRENT_BALANCE: 'Current Balance',
    RECENT_ACTIVITY: 'Recent Distribution Activity',
    ACTIVITY_LOGS: 'Activity Logs',
    EDIT_NAME: 'Edit Name',
    VIEW_DETAILS: 'View Details',
    VIEW_HISTORY: 'View History',
} as const;

// Wallet Details Page
export const WALLET_DETAILS_TEXT = {
    BREADCRUMB_WALLETS: 'Wallets',
    EXPORT_CSV: 'Export CSV',
    TOP_UP: 'Top Up',
    ACTIVE: 'Active',
    CURRENT_BALANCE: 'Current Balance',
    OVERVIEW: 'Overview',
    TOTAL_INCOME: 'Total Income',
    TOTAL_SPENT: 'Total Spent',
    APY_GROWTH: 'APY Growth',
    VIEW_FULL_REPORT: 'View Full Report',
    BALANCE_TRENDS: 'Balance Trends',
    RECENT_TRANSACTIONS: 'Recent Transactions',
    VIEW_ALL: 'View All',
    TECHNICAL_METADATA: 'Technical Metadata',
    LEDGER_ADDRESS: 'Ledger Address',
    CREATION_DATE: 'Creation Date',
    WALLET_TYPE: 'Wallet Type',
    SECURITY_FEATURES: 'Security Features',
    TWO_FA_ENABLED: '2FA Enabled',
    COLD_STORAGE: 'Cold Storage',
    PORTFOLIO_INSIGHTS: 'Portfolio Insights',
    REVIEW_OPTIMIZER: 'Review Optimizer',
    TIME_PERIODS: {
        DAY: '1D',
        WEEK: '1W',
        MONTH: '1M',
        YEAR: '1Y',
    },
    DAYS_OF_WEEK: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
} as const;

// Activity Table Headers
export const ACTIVITY_TABLE_HEADERS = {
    DATE: 'Date',
    DESCRIPTION: 'Description',
    WALLET: 'Wallet',
    AMOUNT: 'Amount',
    STATUS: 'Status',
} as const;

// Add Wallet Modal
export const ADD_WALLET_MODAL_TEXT = {
    TITLE: 'Add New Wallet',
    SUBTITLE: 'Create a new wallet to manage your funds',
    WALLET_NAME_LABEL: 'Wallet Name',
    WALLET_NAME_PLACEHOLDER: 'e.g. Daily Expenses, Travel Fund',
    CURRENCY_LABEL: 'Currency Type',
    PURPOSE_LABEL: 'Wallet Purpose',
    INITIAL_BALANCE_LABEL: 'Initial Balance',
    INITIAL_BALANCE_PLACEHOLDER: '0.00',
    CANCEL: 'Cancel',
    CREATE_WALLET: 'Create Wallet',
} as const;

// Currency options for wallet creation
export const CURRENCY_OPTIONS = [
    { value: 'SGD', label: 'SGD - Singapore Dollar' },
] as const;

// Transfer Modal
export const TRANSFER_MODAL_TEXT = {
    TITLE: 'Initiate Transfer',
    STEP_INDICATOR: 'Step 1 of 3',
    SOURCE_WALLET_LABEL: 'Source Wallet',
    RECIPIENT_LABEL: 'Recipient ID or Email',
    RECIPIENT_PLACEHOLDER: 'e.g. user@apexpay.net or #882910',
    SELECT_FROM_CONTACTS: 'Select from Contacts',
    AMOUNT_LABEL: 'Amount',
    AMOUNT_PLACEHOLDER: '0.00',
    CURRENCY_LABEL: 'Currency',
    CLIENT_REQUEST_ID: 'Client Request ID',
    CONFIRM_TRANSFER: 'Confirm Transfer',
    CANCEL: 'Cancel',
    ENCRYPTED_TRANSFER: 'End-to-End Encrypted Transfer',
    TRANSFER_FAILED: 'Transfer Failed',
    SELECT_WALLET: 'Select Wallet',
    NO_WALLET_SELECTED: 'No wallet selected',
    CHANGE_WALLET: 'Change',
    LOADING_CONTACTS: 'Loading contacts...',
    NO_CONTACTS_FOUND: 'No contacts found',
    AVAILABLE_SUFFIX: 'available',
} as const;

// Wallet Card
export const WALLET_CARD_TEXT = {
    TOP_UP: 'Top Up',
    TRANSFER: 'Transfer',
    WALLET_OPTIONS: 'Wallet options',
} as const;

// Activity Table
export const ACTIVITY_TABLE_TEXT = {
    LOADING: 'Loading activities...',
    NO_ACTIVITY: 'No recent activity',
} as const;

// Balance Card
export const BALANCE_CARD_TEXT = {
    LOCKED: 'Locked',
} as const;

// Sidebar / Navigation
export const NAVIGATION_TEXT = {
    DASHBOARD: 'Dashboard',
    WALLETS: 'Wallets',
    PAYMENT: 'Payment',
    HISTORY: 'History',
    ANALYTICS: 'Analytics',
    SETTINGS: 'Settings',
    SIGN_OUT: 'Sign Out',
    SIGNING_OUT: 'Signing Out...',
} as const;

// Edit Wallet Name Modal
export const EDIT_WALLET_MODAL_TEXT = {
    TITLE: 'Edit Name',
    WALLET_NAME_LABEL: 'Wallet Name',
    WALLET_NAME_PLACEHOLDER: 'Enter wallet name',
    HELP_TEXT: 'Choose a name that helps you identify this ledger.',
    CANCEL: 'Cancel',
    SAVE_CHANGES: 'Save Changes',
    SAVING: 'Saving...',
} as const;

// Top Up Modal - Quick Amounts
export const TOP_UP_QUICK_AMOUNTS = {
    TEN: '+$10.00',
    FIFTY: '+$50.00',
    HUNDRED: '+$100.00',
} as const;

// Payment Methods
export const PAYMENT_METHODS_TEXT = {
    NO_METHODS_AVAILABLE: 'No payment methods available',
} as const;

// Wallet Details Transaction Table
export const WALLET_TRANSACTION_TABLE_TEXT = {
    TRANSACTION: 'Transaction',
    DATE: 'Date',
    STATUS: 'Status',
    AMOUNT: 'Amount',
    NO_TRANSACTIONS: 'No transactions yet',
    STATUS_COMPLETED: 'COMPLETED',
    STATUS_PROCESSING: 'PROCESSING',
    STATUS_FAILED: 'FAILED',
} as const;

// Wallets Page
export const WALLETS_PAGE_TEXT = {
    NO_WALLETS: 'No wallets yet. Create your first wallet to get started.',
} as const;

// Wallet Details Page
export const WALLET_DETAILS_PAGE_TEXT = {
    LOADING: 'Loading wallet details...',
    NOT_FOUND: 'Wallet not found',
    BACK_TO_WALLETS: 'Back to Wallets',
} as const;

// Transaction History Page
export const TRANSACTION_HISTORY_TEXT = {
    SHOWING_TRANSACTIONS_FOR: (walletName: string) => `Showing transactions for ${walletName}`,
    FILTERED_BY: 'Filtered by:',
    VIEW_WALLET: 'View wallet →',
    LOADING: 'Loading transactions...',
    FAILED_TO_LOAD: 'Failed to load transactions',
    TRY_AGAIN: 'Try again',
    WALLET_HEADER: 'Wallet',
} as const;

// Portfolio Insights
export const PORTFOLIO_INSIGHTS_TEXT = {
    PERFORMANCE_MESSAGE: (walletName: string, percent: number) =>
        `Your ${walletName} wallet is performing ${percent}% better than the platform average this month. Consider adding more funds to maximize yield.`,
} as const;

// Dynamic Text Template Functions
export const DYNAMIC_TEXT = {
    /** Displays character count for input fields (e.g., "25/50") */
    CHARACTER_COUNT: (current: number, max: number) => `${current}/${max}`,
    /** Truncates a ledger/wallet address for display (e.g., "0x71C765...0ABCDEF") */
    TRUNCATED_ADDRESS: (address: string, prefixLength = 8, suffixLength = 10) =>
        `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`,
    /** Displays pagination info (e.g., "Page 1 • 25 transactions") */
    PAGINATION_INFO: (page: number, count: number) => `Page ${page} • ${count} transactions`,
    /** Displays growth percentage with sign (e.g., "+12.4%") */
    GROWTH_PERCENT: (percent: number) => `+${percent}%`,
    /** Displays amount with prefix for credit/debit (e.g., "+ $100.00" or "- $50.00") */
    AMOUNT_WITH_PREFIX: (isCredit: boolean) => isCredit ? '+ ' : '- ',
} as const;
