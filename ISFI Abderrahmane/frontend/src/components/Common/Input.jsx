import { useState } from 'react';
import clsx from 'clsx';
import { HelpCircle } from 'lucide-react';

/**
 * Dark-themed Input Component matching Login/Register forms
 * Features:
 * - Dark background (bg-[var(--color-surface)])
 * - Border color (border-[var(--color-border)])
 * - Focus ring (focus:bg-[var(--color-bg)])
 * - White text
 * - Hover gradient effect
 * - Rounded corners
 * - Optional Tooltip
 */
function Input({
  label,
  error,
  helperText,
  tooltip,
  className,
  required,
  ...props
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {tooltip && (
            <div 
              className="relative flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
              
              {/* Tooltip Popup */}
              {showTooltip && (
                <div className="absolute left-full ml-2 bottom-0 w-48 p-2 bg-popover border border-border rounded-md shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-xs text-popover-foreground leading-relaxed">
                    {tooltip}
                  </p>
                  {/* Arrow */}
                  <div className="absolute left-0 bottom-2 -translate-x-1/2 w-2 h-2 bg-popover border-l border-b border-border rotate-45 transform" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Input wrapper for hover effect */}
      <div className="relative w-full">
        <input
          className={clsx(
            // Base styles
            'peer relative z-10 border border-input h-10 w-full rounded-md bg-background px-4 py-2 font-medium outline-none shadow-sm transition-all duration-200 ease-in-out',
            // Focus state
            'focus:ring-2 focus:ring-ring focus:border-input',
            // Text and placeholder
            'text-foreground placeholder:font-medium placeholder:text-muted-foreground',
            // Error state
            error && 'border-destructive focus:ring-destructive/30',
            className
          )}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...props}
        />
        
        {/* Hover gradient effect - top and bottom borders */}
        {isHovering && !error && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default Input;

