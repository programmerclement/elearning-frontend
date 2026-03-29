import { useState } from 'react';
import { useCreatePayment, usePreviewInvoice } from '../../hooks/useApi';

export const EnrollmentModal = ({ course, onClose, onSuccess }) => {
  const [step, setStep] = useState('preview'); // preview, payment, success
  const { data: invoiceData, isLoading: invoiceLoading } = usePreviewInvoice({
    courseId: course.id,
    enabled: step === 'preview',
  });
  const { mutate: processPayment, isPending } = useCreatePayment();
  const [paymentError, setPaymentError] = useState('');

  const invoice = invoiceData?.data?.invoice || {};

  const handlePayment = () => {
    processPayment(
      {
        course_id: course.id,
        amount: invoice.total,
      },
      {
        onSuccess: () => {
          setStep('success');
          setTimeout(() => {
            onSuccess();
          }, 2000);
        },
        onError: (error) => {
          setPaymentError(error?.message || 'Payment failed. Please try again.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Enroll in Course</h3>
            <p className="text-gray-600 mb-6">{course.title}</p>

            {invoiceLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${(Number(invoice.subtotal) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%):</span>
                    <span className="font-medium">${(Number(invoice.vat) || 0).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${(Number(invoice.total) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment</h3>

            {paymentError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {paymentError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={isPending}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {isPending ? 'Processing...' : `Pay $${(Number(invoice.total) || 0).toFixed(2)}`}
              </button>
              <button
                onClick={() => setStep('preview')}
                disabled={isPending}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:bg-gray-100"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Enrollment Successful!</h3>
            <p className="text-gray-600 mb-2">You have successfully enrolled in</p>
            <p className="font-semibold text-gray-800 mb-4">{course.title}</p>
            <p className="text-sm text-gray-500">Redirecting to course content...</p>
          </div>
        )}
      </div>
    </div>
  );
};
