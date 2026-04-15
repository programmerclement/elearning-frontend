import React from 'react';

/**
 * DashboardStats Component
 * Displays key statistics in card format
 */
export const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Completed',
      value: stats?.completed || 0,
      icon: '✓',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      iconBg: 'bg-green-200',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      icon: '⏳',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      iconBg: 'bg-yellow-200',
    },
    {
      label: 'Not Started',
      value: stats?.notStarted || 0,
      icon: '○',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      iconBg: 'bg-gray-200',
    },
    {
      label: 'Avg. Progress',
      value: `${stats?.averageProgress || 0}%`,
      icon: '📊',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow-md p-6 border-l-4 ${card.textColor} border-opacity-0 hover:shadow-lg transition`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${card.textColor}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
