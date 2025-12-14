import clsx from 'clsx';

/**
 * Dark-themed Button Component matching Login/Register forms
 * Features:
 * - Primary: Blue button with hover effects
 * - Secondary: Gray button with hover effects
 * - Danger: Red button for destructive actions
 * - Ghost: Transparent button
 * - Shine animation on hover
 * - Icons display horizontally next to text
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  type = 'button',
  ...props
}) {
  const baseStyles = 'group/button relative inline-flex flex-row items-center justify-center gap-2 overflow-hidden rounded-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-secondary/20',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-destructive/20',
    ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content wrapper - ensures icons and text are horizontal */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
      
      {/* Shine animation on hover - matches login button */}
      {!disabled && !loading && (
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div className="relative h-full w-8 bg-white/20" />
        </div>
      )}
    </button>
  );
}

export default Button;

