import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_51R2BvYJ8PpmtveDNTab42yFslbfMPPkQJFbFmuffpiaabMz1VTSPm7RnKFqZNcUNMyummKvrabp1KARwNP6cTNFy001Fllgrzl');

// Passport Payment Form Component
const PassportPaymentForm = ({ onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingType, setProcessingType] = useState('regular');

  // Fixed fees
  const fees = {
    regular: 50,
    express: 75
  };

  // Card Payment Component
  const CardPayment = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      setLoading(true);
      setError(null);

      try {
        // Process card payment
        const cardElement = elements.getElement(CardElement);

        // Simulate payment processing
        await new Promise(r => setTimeout(r, 1000));

        // Successful payment simulation
        setLoading(false);
        onComplete && onComplete({
          success: true,
          method: 'card',
          amount: fees[processingType],
          processingType: processingType
        });
      } catch (err) {
        setError('Payment processing failed. Please try again.');
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Card Details</label>
          <div className="p-3 border rounded-lg bg-white dark:bg-gray-700">
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </div>
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${fees[processingType]}`}
        </button>
      </form>
    );
  };

  // Mobile Payment Component (M-Pesa & Econet)
  const MobilePayment = ({ provider }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!phoneNumber) {
        setError(`Please enter your ${provider} phone number`);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Simulate mobile payment processing
        await new Promise(r => setTimeout(r, 1000));

        // Successful payment simulation
        setLoading(false);
        onComplete && onComplete({
          success: true,
          method: provider.toLowerCase(),
          phoneNumber: phoneNumber,
          amount: fees[processingType],
          processingType: processingType
        });
      } catch (err) {
        setError('Payment processing failed. Please try again.');
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{provider} Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-lg text-base dark:bg-gray-700 dark:text-white"
            placeholder={provider === 'M-Pesa' ? 'e.g. 254712345678' : 'e.g. 263712345678'}
            required
          />
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
          <p className="text-sm">
            You'll receive a payment prompt on your phone for ${fees[processingType]}
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 ${
            provider === 'M-Pesa' ? 'bg-green-600' : 'bg-blue-600'
          }`}
        >
          {loading ? 'Processing...' : `Pay with ${provider}`}
        </button>
      </form>
    );
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Passport Application Payment</h2>

      {/* Processing Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Processing Type</label>
        <select
          value={processingType}
          onChange={(e) => setProcessingType(e.target.value)}
          className="w-full p-3 border rounded-lg text-base dark:bg-gray-700 dark:text-white"
        >
          <option value="regular">Regular Processing - $50 (7-10 days)</option>
          <option value="express">Express Processing - $75 (2-3 days)</option>
        </select>
      </div>

      {/* Payment Method Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${paymentMethod === 'card' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          Card
        </button>
        <button
          className={`px-4 py-2 ${paymentMethod === 'mpesa' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setPaymentMethod('mpesa')}
        >
          M-Pesa
        </button>
        <button
          className={`px-4 py-2 ${paymentMethod === 'econet' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setPaymentMethod('econet')}
        >
          Econet
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg mb-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Payment Forms */}
      {paymentMethod === 'card' && (
        <Elements stripe={stripePromise}>
          <CardPayment />
        </Elements>
      )}

      {paymentMethod === 'mpesa' && (
        <MobilePayment provider="M-Pesa" />
      )}

      {paymentMethod === 'econet' && (
        <MobilePayment provider="Econet" />
      )}
    </div>
  );
};

// Main component with success state handling
const PassportPayment = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentComplete = (details) => {
    setPaymentDetails(details);
    setPaymentComplete(true);
  };

  const resetPayment = () => {
    setPaymentComplete(false);
    setPaymentDetails(null);
  };

  return (
    <div className="max-w-md mx-auto">
      {paymentComplete ? (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="mb-4">
            Thank you for your payment of ${paymentDetails?.amount} for your
            passport application with {paymentDetails?.processingType === 'express' ? 'express' : 'regular'} processing.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            A confirmation has been sent to your {paymentDetails?.method === 'card' ? 'email' : 'phone'}.
          </p>
          <button
            onClick={resetPayment}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Make Another Payment
          </button>
        </div>
      ) : (
        <PassportPaymentForm onComplete={handlePaymentComplete} />
      )}
    </div>
  );
};

export default PassportPayment;