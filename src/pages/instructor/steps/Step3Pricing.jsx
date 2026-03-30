import React from 'react';

/**
 * Step 3: Pricing & Payment
 * Shows invoice breakdown and coupon support
 */
const Step3Pricing = ({ formData, setFormData, invoicePreview, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: '💳' },
    { id: 'mobile_money', name: 'Mobile Money', icon: '📱' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'paypal', name: 'PayPal', icon: '🛒' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pricing & Payment</h2>
      <p className="text-gray-600">Review the pricing and select your payment method</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Payment Method Selection */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={formData.payment_method === method.id}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <div className="ml-3">
                  <p className="font-medium">{method.icon} {method.name}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Coupon Code */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Apply
              </button>
            </div>
            {invoicePreview?.coupon && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Coupon applied: {invoicePreview.coupon.discount_percentage}% off
              </p>
            )}
          </div>
        </div>

        {/* Right: Invoice Breakdown */}
        <div className="col-span-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Invoice Breakdown</h3>

            {invoicePreview ? (
              <div className="space-y-4">
                {/* Pricing Lines */}
                <div className="space-y-3 pb-4 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Original Price:</span>
                    <span className="font-semibold">
                      ${invoicePreview.original_price?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {invoicePreview.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount:</span>
                      <span className="font-semibold">
                        -${invoicePreview.discount_amount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">
                      ${invoicePreview.subtotal?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Service Fee (5%):</span>
                    <span className="font-semibold">
                      ${invoicePreview.service_fee?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">VAT (15%):</span>
                    <span className="font-semibold">
                      ${invoicePreview.vat?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${invoicePreview.total?.toFixed(2) || '0.00'}
                  </span>
                </div>

                {/* Payment Breakdown Details */}
                <div className="mt-6 bg-white rounded-lg p-4 text-sm text-gray-600 space-y-1">
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
          <li>Any applicable coupon discounts</li>
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
