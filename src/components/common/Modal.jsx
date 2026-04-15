import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
  showFooter = true,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'default'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="border-t border-gray-200 px-6 py-4 flex gap-2 justify-end">
            <Button 
              variant="ghost" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button 
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showFooter: PropTypes.bool,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'danger']),
};
