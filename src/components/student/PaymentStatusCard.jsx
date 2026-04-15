import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

/**
 * PaymentStatusCard Component
 * Display subscription and payment information
 */
export const PaymentStatusCard = ({
  subscription = {},
  onUpgradeClick,
  onRenewClick,
}) => {
  const {
    planName = 'Free Plan',
    paymentMethod = 'Not set',
    status = 'inactive',
    expiresAt = null,
  } = subscription;

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      failed: 'danger',
      inactive: 'default',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  const isExpiringSoon = expiresAt && new Date(expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card
      variant="outlined"
      className="bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{planName}</h3>
          <Badge label={status.toUpperCase()} variant={getStatusBadge(status)} />
        </div>
        <div className="text-4xl">💳</div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-gray-600 text-sm">Payment Method</p>
          <p className="font-medium text-gray-800">{paymentMethod}</p>
        </div>

        {expiresAt && (
          <div>
            <p className="text-gray-600 text-sm">
              {isExpiringSoon ? 'Expires Soon' : 'Expires On'}
            </p>
            <p className={`font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-gray-800'}`}>
              {new Date(expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {(status === 'inactive' || status === 'cancelled') && onUpgradeClick && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUpgradeClick}
            fullWidth
          >
            Upgrade Plan
          </Button>
        )}
        {status === 'active' && isExpiringSoon && onRenewClick && (
          <Button
            variant="warning"
            size="sm"
            onClick={onRenewClick}
            fullWidth
          >
            Renew Subscription
          </Button>
        )}
      </div>
    </Card>
  );
};
