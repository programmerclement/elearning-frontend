import { useState } from 'react';
import { useCreatePayment, usePreviewInvoice } from '../../hooks/useApi';
import { couponAPI } from '../../api/apiService';

/**
 * ENROLLMENT MODAL - SINGLE STEP
 * All payment details in one modal
 * - Select payment method (Bank Card, MTN, Airtel)
 * - Enter payment details
 * - Apply coupon (optional)
 * - View total and confirm
 */
export const EnrollmentModal = ({ course, onClose, onSuccess }) => {
  const [step, setStep] = useState('payment'); // payment or success
  const { data: invoiceData } = usePreviewInvoice({
    courseId: course.id,
    enabled: true,
  });
  const { mutate: processPayment, isPending } = useCreatePayment();
  const [paymentError, setPaymentError] = useState('');
  
  // Payment method: 'card', 'mtn', or 'airtel'
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Card fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // Mobile Money fields (MTN/Airtel)
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileOperator, setMobileOperator] = useState('MTN');
  const [transactionRef, setTransactionRef] = useState('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  const invoice = invoiceData?.data?.invoice || {};
  const baseTotal = Number(invoice.total) || Number(course.price) || 0;
  const discountAmount = couponDiscount > 0 ? (baseTotal * couponDiscount) / 100 : 0;
  const finalTotal = baseTotal - discountAmount;
  
  // Validation
  const isCardValid = 
    cardholderName.trim().length > 0 &&
    cardNumber.replace(/\s/g, '').length >= 13 &&
    expiryDate.length === 4 &&
    cvv.length >= 3;
    
  // Mobile money validation with Rwanda-specific prefixes
  const isMobileMoneyValid = () => {
    const num = mobileNumber.trim();
    if (num.length < 10) return false;
    
    // Remove leading + or 0 for validation
    const normalizedNum = num.replace(/^\+?256|^0/, '');
    const lastTenDigits = normalizedNum.slice(-10);
    
    if (paymentMethod === 'mtn') {
      // MTN: Must start with 078 or 079 (10 digits total)
      return lastTenDigits.match(/^(078|079)\d{7}$/) !== null;
    } else if (paymentMethod === 'airtel') {
      // Airtel: Must start with 072 or 073 (10 digits total)
      return lastTenDigits.match(/^(072|073)\d{7}$/) !== null;
    }
    return false;
  };
  
  const isPaymentValid = paymentMethod === 'card' ? isCardValid : isMobileMoneyValid();
  const isPaymentDetailsValid = isPaymentValid;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('');
      setCouponDiscount(0);
      return;
    }

    try {
      const response = await couponAPI.verifyCoupon(couponCode);
      console.log('Coupon verification response:', response);
      
      // Check if API call was successful
      if (response && response.success && response.data) {
        const couponData = response.data;
        
        // Check if coupon is active
        if (couponData.is_active === 0 || !couponData.is_active) {
          setCouponError('This coupon is no longer active');
          setCouponDiscount(0);
          return;
        }

        // Check if coupon has remaining uses
        if (couponData.max_uses && couponData.remaining_uses !== null && couponData.remaining_uses <= 0) {
          setCouponError('This coupon has reached its usage limit');
          setCouponDiscount(0);
          return;
        }

        // Check expiry
        if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
          setCouponError('This coupon has expired');
          setCouponDiscount(0);
          return;
        }

        // Get discount percentage
        const discount = couponData.discount_percentage || 0;
        if (discount > 0) {
          setCouponDiscount(discount);
          setCouponError('');
          console.log(`Coupon ${couponCode} applied: ${discount}% discount`);
        } else {
          setCouponError('Invalid coupon discount');
          setCouponDiscount(0);
        }
      } else if (response && response.message) {
        setCouponError(response.message);
        setCouponDiscount(0);
      } else {
        setCouponError('Invalid coupon code');
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error('Coupon verification error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Invalid coupon code';
      setCouponError(errorMsg);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    if (couponDiscount > 0) {
      // Coupon is already applied - cannot be removed
      setCouponError('Coupon cannot be removed after being applied. Please cancel and start over.');
      return;
    }
    setCouponCode('');
    setCouponError('');
    setCouponDiscount(0);
  };

  const handlePayment = () => {
    const paymentData = {
      course_id: course.id,
      amount: finalTotal,
      coupon_code: couponCode || undefined,
      payment_method: paymentMethod,
    };

    if (paymentMethod === 'card') {
      paymentData.cardholder_name = cardholderName;
      paymentData.card_number = cardNumber;
      paymentData.expiry_date = expiryDate;
      paymentData.cvv = cvv;
      paymentData.save_card = saveCard;
    } else {
      paymentData.mobile_number = mobileNumber;
      paymentData.mobile_operator = paymentMethod.toUpperCase(); // MTN or AIRTEL
    }

    processPayment(paymentData, {
      onSuccess: () => {
        setStep('success');
        setTimeout(() => {
          // Call onSuccess callback
          if (onSuccess) onSuccess();
          // Reload page after success to fetch updated enrolled courses
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }, 2000);
      },
      onError: (error) => {
        setPaymentError(error?.message || 'Payment failed. Please try again.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="sticky top-4 right-4 absolute z-10 text-gray-500 hover:text-gray-700 text-2xl font-light p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        )}

        {/* Header */}
        {step !== 'success' && (
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-2">Enroll in Course</h2>
            <p className="text-sm text-blue-100">{course.title}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Payment Details</h3>
                <p className="text-sm text-gray-600 mb-4">Select payment method and enter your details</p>

                {/* Course Price */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Course: {course.title}</p>
                  <p className="text-3xl font-bold text-blue-600">{baseTotal > 0 ? `${baseTotal.toFixed(2)} RWF` : '0.00 RWF'}</p>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Select Payment Method *</label>
                  <div className="space-y-2">
                    {/* Bank Card */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'card' && <div className="text-white text-xs flex items-center justify-center h-full">✓</div>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">💳 Bank Card</p>
                          <p className="text-xs text-gray-600">Visa, Mastercard, or other debit/credit card</p>
                        </div>
                      </div>
                    </button>

                    {/* MTN */}
                    <button
                      onClick={() => setPaymentMethod('mtn')}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        paymentMethod === 'mtn'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          paymentMethod === 'mtn' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'mtn' && <div className="text-white text-xs flex items-center justify-center h-full">✓</div>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">📱 MTN Mobile Money</p>
                          <p className="text-xs text-gray-600">Pay instantly from your MTN account</p>
                        </div>
                      </div>
                    </button>

                    {/* Airtel */}
                    <button
                      onClick={() => setPaymentMethod('airtel')}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        paymentMethod === 'airtel'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          paymentMethod === 'airtel' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'airtel' && <div className="text-white text-xs flex items-center justify-center h-full">✓</div>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">📱 Airtel Money</p>
                          <p className="text-xs text-gray-600">Pay instantly from your Airtel account</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200 mb-6">
                    <h4 className="font-semibold text-gray-800">Bank Card Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        placeholder="1234567890123"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
                        maxLength="19"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">13-19 digits</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year *</label>
                        <input
                          type="text"
                          placeholder="2025"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">YYYY</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">3-4 digits</p>
                      </div>
                    </div>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Save card for future payments</span>
                    </label>
                  </div>
                )}

                {/* Mobile Money Form */}
                {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200 mb-6">
                    <h4 className="font-semibold text-gray-800">{paymentMethod === 'mtn' ? 'MTN' : 'Airtel'} Mobile Number</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        placeholder={paymentMethod === 'mtn' ? "078XXXXXXXX or +250788XXXXXX" : "072XXXXXXXX or +250722XXXXXX"}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                          mobileNumber && !isMobileMoneyValid() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {paymentMethod === 'mtn' 
                          ? '10 digits starting with 078 or 079 (e.g., 0788123456)'
                          : '10 digits starting with 072 or 073 (e.g., 0722123456)'}
                      </p>
                      {mobileNumber && !isMobileMoneyValid() && (
                        <p className="text-xs text-red-600 mt-1">❌ Invalid {paymentMethod.toUpperCase()} number format</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Coupon Code */}
                <div className={`rounded-lg p-4 border mb-6 ${
                  couponDiscount > 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">🎟️ Coupon Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={couponDiscount > 0}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                        couponDiscount > 0 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {couponDiscount > 0 ? (
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={true}
                        className="px-4 py-2 bg-gray-400 cursor-not-allowed text-white rounded-lg font-medium whitespace-nowrap text-sm"
                        title="Coupon cannot be removed once applied"
                      >
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={handleValidateCoupon}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition whitespace-nowrap text-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && <p className="text-xs text-red-600 mt-2">❌ {couponError}</p>}
                  {couponDiscount > 0 && <p className="text-xs text-green-700 mt-2 font-semibold">✓ {couponDiscount}% discount applied! (Cannot be removed - must complete or cancel enrollment)</p>}
                </div>

                {/* Total Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-6">
                  <div className="space-y-2 mb-3 pb-3 border-b border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">{baseTotal.toFixed(2)} RWF</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-700 font-semibold">
                        <span>Discount ({couponDiscount}%):</span>
                        <span>-{discountAmount.toFixed(2)} RWF</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total to Pay:</span>
                    <span className="text-3xl font-bold text-green-600">{finalTotal.toFixed(2)} RWF</span>
                  </div>
                </div>

                {/* Error Message */}
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                    ❌ {paymentError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handlePayment}
                    disabled={!isPaymentValid || isPending}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `✓ Confirm & Pay ${finalTotal.toFixed(2)} RWF`
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={isPending}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Page */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-4xl">✓</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Successfully Activated!</h3>
              </div>
              <p className="text-gray-600 mb-2">🎉 You are now enrolled in:</p>
              <p className="text-xl font-semibold text-gray-800 mb-8">{course.title}</p>
              <p className="text-sm text-gray-500">🔄 Redirecting to course content...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
