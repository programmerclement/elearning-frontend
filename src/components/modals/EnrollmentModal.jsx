import { useState } from 'react';
import { useCreatePayment, usePreviewInvoice } from '../../hooks/useApi';
import { couponAPI } from '../../api/apiService';

export const EnrollmentModal = ({ course, onClose, onSuccess }) => {
  // Steps: preview -> cardholder_info -> card_details -> coupon_review -> payment -> success
  const [step, setStep] = useState('preview');
  const { data: invoiceData, isLoading: invoiceLoading } = usePreviewInvoice({
    courseId: course.id,
    enabled: step === 'preview',
  });
  const { mutate: processPayment, isPending } = useCreatePayment();
  const [paymentError, setPaymentError] = useState('');
  
  // Payment form fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Step validation
  const isCardholderValid = cardholderName.trim().length > 0;
  const isCardNumberValid = cardNumber.replace(/\s/g, '').length >= 13;
  const isExpiryValid = expiryDate.length === 4;
  const isCvvValid = cvv.length >= 3;
  
  // Step indicators
  const steps = ['preview', 'cardholder_info', 'card_details', 'coupon_review', 'payment', 'success'];
  const currentStepIndex = steps.indexOf(step);
  const totalSteps = step === 'success' ? 1 : steps.length - 2; // Exclude success from progress

  const invoice = invoiceData?.data?.invoice || {};

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('');
      setCouponDiscount(0);
      return;
    }

    try {
      const response = await couponAPI.verifyCoupon(couponCode);
      if (response.success) {
        const discount = response.data.discount_percentage || 0;
        setCouponDiscount(discount);
        setCouponError('');
      } else {
        setCouponError('Invalid or inactive coupon code');
        setCouponDiscount(0);
      }
    } catch (error) {
      setCouponError('Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  const finalTotal = Math.max(0, (Number(invoice.total) || 0) - couponDiscount);

  const handlePayment = () => {
    processPayment(
      {
        course_id: course.id,
        amount: finalTotal,
        coupon_code: couponCode || undefined,
        cardholder_name: cardholderName,
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv: cvv,
        save_card: saveCard,
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

  // ========== STEP COMPONENTS ==========

  // Step 1: Preview
  const PreviewStep = ({ invoice, invoiceLoading, course, onNext, onCancel }) => (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Course Overview</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-6">{course.title}</p>

      {invoiceLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 space-y-3 border border-blue-200">
            <h4 className="font-semibold text-gray-800">Price Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${(Number(invoice?.subtotal) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (15%):</span>
              <span className="font-medium">${(Number(invoice?.vat) || 0).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-gray-800">Total Amount:</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600">
                ${(Number(invoice?.total) || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Step 2: Cardholder Info
  const CardholderInfoStep = ({ cardholderName, setCardholderName, isValid, onNext, onBack }) => (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Information</h3>
      <p className="text-sm text-gray-600 mb-6">Enter the name associated with your card</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">The name must match your ID or bank records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
        <button
          onClick={onBack}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Step 3: Card Details
  const CardDetailsStep = ({ cardNumber, setCardNumber, expiryDate, setExpiryDate, cvv, setCvv, isValid, onNext, onBack }) => (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Card Information</h3>
      <p className="text-sm text-gray-600 mb-6">Enter your card details</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="1070000000000"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
            maxLength="19"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
          />
          <p className="text-xs text-gray-500 mt-2">Enter 13-19 digit card number</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="2025"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">YYYY format</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">3-4 digits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
        <button
          onClick={onBack}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Step 4: Coupon & Review
  const CouponReviewStep = ({ couponCode, setCouponCode, couponError, couponDiscount, handleValidateCoupon, invoice, saveCard, setSaveCard, finalTotal, onNext, onBack }) => (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Discount & Review</h3>
      <p className="text-sm text-gray-600 mb-6">Have a coupon code? Apply it now</p>

      <div className="space-y-4 mb-6">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coupon Code (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleValidateCoupon}
              className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition whitespace-nowrap"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
          {couponDiscount > 0 && <p className="text-xs text-green-600 mt-2">✓ {couponDiscount}% discount applied!</p>}
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-5 border border-blue-200 space-y-2">
          <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${(Number(invoice?.subtotal) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (15%):</span>
            <span className="font-medium">${(Number(invoice?.vat) || 0).toFixed(2)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 border-t pt-2">
              <span>Coupon Discount ({couponDiscount}%):</span>
              <span>-${couponDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold text-gray-800">Total to Pay:</span>
            <span className="text-lg font-bold text-blue-600">
              ${finalTotal.toFixed(2)} RF
            </span>
          </div>
        </div>

        {/* Save Card */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Save card for future purchases</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onNext}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Review & Pay
        </button>
        <button
          onClick={onBack}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Step 5: Payment Confirmation
  const PaymentStep = ({ course, finalTotal, invoice, cardholderName, paymentError, isPending, onConfirm, onBack }) => (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Confirm Payment</h3>
      <p className="text-sm text-gray-600 mb-6">Review and confirm your payment</p>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          ❌ {paymentError}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Order Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Course:</span>
              <span className="font-medium">{course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${(Number(invoice?.total) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cardholder:</span>
              <span className="font-medium">{cardholderName}</span>
            </div>
          </div>
        </div>

        {/* Final Amount */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Final Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ${finalTotal.toFixed(2)} RF
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-xs sm:text-sm font-semibold mb-2">⚠️ Important</p>
          <ul className="text-red-700 text-xs space-y-1 list-disc list-inside">
            <li>Ensure sufficient funds in your account</li>
            <li>Check that amount matches</li>
            <li>You will receive an invoice via email</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay ${finalTotal.toFixed(2)} RF`
          )}
        </button>
        <button
          onClick={onBack}
          disabled={isPending}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:bg-gray-100"
        >
          Back
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center mt-4">
        By confirming, you agree to our payment terms and conditions
      </p>
    </div>
  );

  // Step 6: Success
  const SuccessStep = ({ course }) => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Enrollment Successful!</h3>
      </div>
      <p className="text-gray-600 mb-2">You have successfully enrolled in:</p>
      <p className="text-lg font-semibold text-gray-800 mb-6">{course.title}</p>
      <p className="text-sm text-gray-500">🔄 Redirecting to course content...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        {step !== 'processing' && step !== 'success' && (
          <button
            onClick={onClose}
            className="sticky top-4 right-4 absolute z-10 text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        )}

        {/* Header with Progress Bar */}
        {step !== 'success' && (
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-bold">Enroll in Course</h2>
              <span className="text-xs sm:text-sm bg-blue-400 px-3 py-1 rounded-full">Step {currentStepIndex} of {totalSteps}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
              ></div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-4 text-xs">
              {['Review', 'Info', 'Card', 'Coupon', 'Pay'].map((label, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col items-center ${idx < currentStepIndex ? 'opacity-100' : idx === currentStepIndex ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${
                    idx < currentStepIndex ? 'bg-white text-blue-600' :
                    idx === currentStepIndex ? 'bg-white text-blue-600 ring-2 ring-blue-300' :
                    'bg-blue-400 text-white'
                  }`}>
                    {idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Preview Step */}
          {step === 'preview' && <PreviewStep invoice={invoiceData?.data?.invoice} invoiceLoading={invoiceLoading} course={course} onNext={() => setStep('cardholder_info')} onCancel={onClose} />}
          
          {/* Cardholder Info Step */}
          {step === 'cardholder_info' && (
            <CardholderInfoStep 
              cardholderName={cardholderName}
              setCardholderName={setCardholderName}
              isValid={isCardholderValid}
              onNext={() => setStep('card_details')}
              onBack={() => setStep('preview')}
            />
          )}
          
          {/* Card Details Step */}
          {step === 'card_details' && (
            <CardDetailsStep 
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              cvv={cvv}
              setCvv={setCvv}
              isValid={isCardNumberValid && isExpiryValid && isCvvValid}
              onNext={() => setStep('coupon_review')}
              onBack={() => setStep('cardholder_info')}
            />
          )}
          
          {/* Coupon & Review Step */}
          {step === 'coupon_review' && (
            <CouponReviewStep 
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              couponDiscount={couponDiscount}
              handleValidateCoupon={handleValidateCoupon}
              invoice={invoiceData?.data?.invoice}
              saveCard={saveCard}
              setSaveCard={setSaveCard}
              finalTotal={finalTotal}
              onNext={() => setStep('payment')}
              onBack={() => setStep('card_details')}
            />
          )}
          
          {/* Payment Step */}
          {step === 'payment' && (
            <PaymentStep 
              course={course}
              finalTotal={finalTotal}
              invoice={invoiceData?.data?.invoice}
              cardholderName={cardholderName}
              paymentError={paymentError}
              isPending={isPending}
              onConfirm={handlePayment}
              onBack={() => setStep('coupon_review')}
            />
          )}
          
          {/* Success Step */}
          {step === 'success' && (
            <SuccessStep course={course} />
          )}
        </div>
      </div>
    </div>
  );
};
