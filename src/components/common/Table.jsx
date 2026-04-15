import React from 'react';
import PropTypes from 'prop-types';

export const Table = ({
  columns,
  data,
  isLoading = false,
  onRowClick = null,
  sortable = true,
  pagination = null,
  onPageChange = null,
}) => {
  const [sortConfig, setSortConfig] = React.useState(null);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig?.key === columnKey && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return data;
    
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const sortedData = getSortedData();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`px-6 py-3 text-left text-sm font-semibold text-gray-800 ${
                  sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortable && sortConfig?.key === col.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="h-8 w-8 mx-auto animate-spin rounded-full border-b-2 border-blue-600" />
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} • {pagination.total} total
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func,
  sortable: PropTypes.bool,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    totalPages: PropTypes.number,
    total: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
};
