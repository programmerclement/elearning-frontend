import React from 'react';
import PropTypes from 'prop-types';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this resource.',
  retry = null,
  className = '',
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="text-red-500 text-2xl mr-4">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
          <p className="text-red-700 mt-2">{message}</p>
          {retry && <div className="mt-4">{retry}</div>}
        </div>
      </div>
    </div>
  );
};

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  retry: PropTypes.node,
  className: PropTypes.string,
};
