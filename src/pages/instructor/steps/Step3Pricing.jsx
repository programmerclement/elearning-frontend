import React, { useState } from 'react';

/**
 * Format price as USD currency
 */
const formatPrice = (value) => {
  const num = parseFloat(value) || 0;
  return num.toFixed(2);
};

/**
 * Step 3: Pricing & Payment
 * Shows invoice breakdown and coupon support
 */
const Step3Pricing = ({ formData, setFormData, invoicePreview, setInvoicePreview, errors, onApplyCoupon }) => {
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCoupon = async () => {
    if (!formData.coupon_code?.trim()) {
      return;
    }

    setCouponLoading(true);
    try {
      if (onApplyCoupon) {
        await onApplyCoupon(formData.coupon_code);
      }
      setAppliedCoupon(formData.coupon_code);
    } catch (err) {
      console.error('Error applying coupon:', err);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleClearCoupon = () => {
    setFormData(prev => ({
      ...prev,
      coupon_code: ''
    }));
    setAppliedCoupon(null);
    setInvoicePreview(prevPreview => {
      if (!prevPreview) return prevPreview;
      return {
        ...prevPreview,
        original_price: prevPreview.subtotal + prevPreview.discount_amount,
        discount_amount: 0,
        subtotal: prevPreview.subtotal + prevPreview.discount_amount,
        coupon: null
      };
    });
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: '💳' },
    { id: 'mobile_money', name: 'Mobile Money', icon: '📱' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'paypal', name: 'PayPal', icon: '🛒' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pricing & Payment</h2>
      <p className="text-xs sm:text-base text-gray-600">Review the pricing and select your payment method</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Payment Method Selection */}
        <div className="col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Payment Method</h3>

          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label key={method.id} className="flex items-center p-2 sm:p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={formData.payment_method === method.id}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium">{method.icon} {method.name}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Coupon Code */}
          <div className="mt-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="Enter code"
                disabled={appliedCoupon !== null}
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
              {appliedCoupon ? (
                <button
                  onClick={handleClearCoupon}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm transition whitespace-nowrap"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !formData.coupon_code?.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-xs sm:text-sm transition whitespace-nowrap"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              )}
            </div>
            {invoicePreview?.coupon && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <span>✓</span> Coupon applied: {invoicePreview.coupon.discount_percentage}% off
              </p>
            )}
          </div>
        </div>

        {/* Right: Invoice Breakdown */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-6 border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-900">Invoice Breakdown</h3>

            {invoicePreview ? (
              <div className="space-y-4">
                {/* Pricing Lines */}
                <div className="space-y-3 pb-4 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-700">Original Price:</span>
                    <span className="font-semibold">
                      ${formatPrice(invoicePreview.original_price)}
                    </span>
                  </div>

                  {invoicePreview.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-xs sm:text-sm text-green-600">
                      <span>Discount ({invoicePreview.coupon?.discount_percentage}%):</span>
                      <span className="font-semibold">
                        -${formatPrice(invoicePreview.discount_amount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">
                      ${formatPrice(invoicePreview.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-700">Service Fee (5%):</span>
                    <span className="font-semibold">
                      ${formatPrice(invoicePreview.service_fee)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-700">VAT (15%):</span>
                    <span className="font-semibold">
                      ${formatPrice(invoicePreview.vat)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-base sm:text-xl font-bold text-gray-900">Total Amount:</span>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ${formatPrice(invoicePreview.total)}
                  </span>
                </div>

                {/* Savings Badge */}
                {invoicePreview.discount_amount > 0 && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-xs sm:text-sm text-center font-semibold">
                    💰 You save ${formatPrice(invoicePreview.discount_amount)} with this coupon!
                  </div>
                )}

                {/* Payment Breakdown Details */}
                <div className="mt-6 bg-white rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600 space-y-1">
                  <p><strong>Payment Terms:</strong> Non-refundable digital product</p>
                  <p><strong>Tax ID:</strong> Will be provided on invoice</p>
                  <p><strong>Currency:</strong> USD</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Click "Next" to load invoice preview</p>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🔒 Payment Security</h4>
            <p className="text-sm text-green-800">
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Step 3 Information</h4>
        <p className="text-sm text-blue-800 mb-2">
          Review the final pricing breakdown before proceeding to payment. The total includes:
        </p>
        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
          <li>Course price (set in Step 1)</li>
          <li>5% platform service fee</li>
          <li>15% VAT (Value Added Tax)</li>
          <li>Any applicable coupon discounts (apply above)</li>
        </ul>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errors.submit}
        </div>
      )}
    </div>
  );
};

export default Step3Pricing;
