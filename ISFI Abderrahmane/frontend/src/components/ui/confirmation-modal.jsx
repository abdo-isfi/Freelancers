import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './modal';
import Button from '../Common/Button';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center">
        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 mb-4 ${
          variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
        }`}>
          <ExclamationTriangleIcon 
            className={`h-6 w-6 ${
              variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'
            }`} 
            aria-hidden="true" 
          />
        </div>
        
        <h3 className="text-lg font-medium leading-6 text-foreground mb-2">
          {title}
        </h3>
        
        <div className="mt-2 mb-6">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        <div className="flex w-full gap-3 justify-center sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
