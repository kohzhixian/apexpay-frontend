export interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  onDismiss?: () => void;
  icon?: string;
}

export const Alert = ({
  variant = 'info',
  title,
  message,
  onDismiss,
  icon,
}: AlertProps) => {
  const variantStyles = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-600 dark:text-red-300',
      dismiss: 'text-red-500 hover:text-red-700 dark:hover:text-red-200',
      defaultIcon: 'error',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-800 dark:text-green-200',
      message: 'text-green-600 dark:text-green-300',
      dismiss: 'text-green-500 hover:text-green-700 dark:hover:text-green-200',
      defaultIcon: 'check_circle',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-600 dark:text-yellow-300',
      dismiss: 'text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-200',
      defaultIcon: 'warning',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-600 dark:text-blue-300',
      dismiss: 'text-blue-500 hover:text-blue-700 dark:hover:text-blue-200',
      defaultIcon: 'info',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`flex items-start gap-3 border rounded-lg p-3 ${styles.container}`}>
      <span className={`material-symbols-outlined shrink-0 text-[20px] mt-0.5 ${styles.icon}`}>
        {icon || styles.defaultIcon}
      </span>
      <div className="flex-1 flex flex-col">
        <p className={`text-sm font-medium leading-tight ${styles.title}`}>
          {title}
        </p>
        {message && (
          <p className={`text-xs mt-1 ${styles.message}`}>
            {message}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`transition-colors ${styles.dismiss}`}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
};
