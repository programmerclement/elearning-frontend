import React from 'react';
import PropTypes from 'prop-types';

export const EmptyState = ({
  title = 'No data',
  description = 'There is nothing to display here.',
  icon = '📭',
  action = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};
