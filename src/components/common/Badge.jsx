import React from 'react';
import PropTypes from 'prop-types';

export const Badge = ({ label, variant = 'default', size = 'md', className = '' }) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-blue-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {label}
    </span>
  );
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'primary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};
