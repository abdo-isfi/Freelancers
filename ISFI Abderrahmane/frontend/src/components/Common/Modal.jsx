import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Dark-themed Modal Component matching Login/Register forms
 * Features:
 * - Dark background (bg-gray-900)
 * - Backdrop blur effect
 * - Rounded corners (rounded-xl)
 * - Subtle shadow
 * - Close button in top-right
 * - Responsive and accessible
 */
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with blur effect - matches login page aesthetic */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-all" 
            style={{ backdropFilter: 'blur(8px)' }}
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* Modal Panel */}
              <Dialog.Panel 
                className={`relative transform overflow-hidden rounded-xl bg-card border border-border px-6 pb-6 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:p-8 ${sizes[size]}`}
              >
                {/* Close button - top right */}
                <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
                  <button
                    type="button"
                    className="rounded-md bg-transparent text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card transition-colors duration-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Title */}
                {title && (
                  <Dialog.Title 
                    as="h3" 
                    className="text-2xl font-bold leading-6 text-foreground mb-6 pr-8"
                  >
                    {title}
                  </Dialog.Title>
                )}
                
                {/* Content */}
                <div className="text-foreground">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;

