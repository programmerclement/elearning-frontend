import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ 
  children, 
  className = '', 
  header = null, 
  footer = null,
  variant = 'default',
  padding = 'p-6'
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow',
    elevated: 'bg-white border-0 rounded-lg shadow-lg',
    outlined: 'bg-white border-2 border-blue-200 rounded-lg',
    ghost: 'bg-transparent rounded-lg',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {header && <div className="border-b border-gray-200 px-6 py-4">{header}</div>}
      <div className={padding}>
        {children}
      </div>
      {footer && <div className="border-t border-gray-200 px-6 py-4">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost']),
  padding: PropTypes.string,
};
