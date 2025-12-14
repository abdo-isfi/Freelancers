import { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Select an option',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-4 py-2.5 rounded-lg border bg-background text-foreground appearance-none cursor-pointer transition-colors';
    const normalClasses = 'border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20';
    const errorClasses = 'border-destructive focus:border-destructive focus:ring-destructive/20';
    const disabledClasses = 'bg-muted cursor-not-allowed opacity-60';

    const selectClasses = `
      ${baseClasses}
      ${error ? errorClasses : normalClasses}
      ${disabled ? disabledClasses : ''}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
