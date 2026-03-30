import React, { useState, useEffect } from 'react';
import { paymentAPI, couponAPI, courseAPI } from '../../api/apiService';

export default function PaymentPage({ courseId, onSuccess }) {
  const [courseData, setCourseData] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Coupon handling
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    fetchInitialData();
  }, [courseId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseRes = await courseAPI.getCourse(courseId);
      if (courseRes.success) {
        setCourseData(courseRes.data);
      }

      // Get invoice preview
      const invoiceRes = await paymentAPI.previewInvoice(courseId);
      if (invoiceRes.success) {
        setInvoice(invoiceRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter coupon code');
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError(null);

      const couponRes = await couponAPI.verifyCoupon(couponCode);
      if (couponRes.success) {
        setCouponApplied(couponRes.data);

        // Refresh invoice with coupon
        const invoiceRes = await paymentAPI.previewInvoice(
          courseId,
          couponCode
        );
        if (invoiceRes.success) {
          setInvoice(invoiceRes.data);
        }
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(null);
    setCouponError(null);
    fetchInitialData();
  };

  const handleProcessPayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      const paymentData = {
        course_id: courseId,
        payment_method: paymentMethod,
      };

      if (couponApplied) {
        paymentData.coupon_code = couponCode;
      }

      const response = await paymentAPI.processPayment(paymentData);
      if (response.success) {
        alert('Payment successful! You are now enrolled in the course.');
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading course details...</div>;
  }

  if (error && !invoice) {
    return (
      <div className="bg-red-100 text-red-800 p-6 rounded-lg">
        {error}
        <button
          onClick={fetchInitialData}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{courseData?.title}</h1>
            <p className="text-gray-600 mb-6">{courseData?.subtitle}</p>

            {courseData?.thumbnail && (
              <img
                src={courseData.thumbnail}
                alt={courseData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Description</h3>
                <p className="text-gray-600">{courseData?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-semibold">
                    {courseData?.instructor?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="font-semibold capitalize">
                    {courseData?.level}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">
                    {courseData?.duration_weeks} weeks
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students Enrolled</p>
                  <p className="font-semibold">
                    {courseData?.student_count || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Coupon Code</h3>
              {couponApplied ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">
                    ✓ Coupon Applied: {couponApplied.code}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    {couponApplied.discount_percentage}% discount
                  </p>
                  <button
                    onClick={handleRemoveCoupon}
                    className="mt-2 text-green-600 hover:text-green-800 text-sm underline"
                  >
                    Remove Coupon
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleVerifyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {couponLoading ? 'Verifying...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-600 text-sm">{couponError}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="debit_card"
                    checked={paymentMethod === 'debit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Debit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {invoice && (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${invoice.original_price?.toFixed(2) || 0}
                  </span>
                </div>

                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between border-b pb-4 text-green-600">
                    <span>Discount ({couponApplied?.discount_percentage}%)</span>
                    <span className="font-semibold">
                      -${invoice.discount_amount?.toFixed(2) || 0}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b pb-4">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">
                    ${invoice.service_fee?.toFixed(2) || 0}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span className="text-gray-600">VAT</span>
                  <span className="font-semibold">
                    ${invoice.vat?.toFixed(2) || 0}
                  </span>
                </div>

                <div className="flex justify-between pt-4">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${invoice.total?.toFixed(2) || 0}
                  </span>
                </div>

                {invoice.coupon && (
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mt-4">
                    Coupon Applied: {invoice.coupon.code}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-100 text-red-800 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleProcessPayment}
              disabled={processing || !invoice}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {processing ? 'Processing Payment...' : 'Complete Payment'}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
