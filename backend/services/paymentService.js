import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../../db/models/Payment.js';
import Order from '../../db/models/Order.js';

let razorpayInstance = null;

// Initialize Razorpay if keys are available in environment
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('💳 [PAYMENT SERVICE] Razorpay SDK initialized successfully.');
  } catch (err) {
    console.error('🚨 [PAYMENT SERVICE] Failed to initialize Razorpay SDK:', err.message);
  }
}

/**
 * Initiates order payment. Creates a Razorpay order if key is present,
 * otherwise completes a simulated payment directly.
 */
export const processUPIPayment = async (orderId, customerId, amount, upiId) => {
  const paymentId = `pay-${Date.now()}`;
  const txnRef = `REF-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

  if (razorpayInstance) {
    try {
      console.log(`💳 [PAYMENT SERVICE] Creating Razorpay order for local order ID: ${orderId}...`);
      const options = {
        amount: Math.round(amount * 100), // Razorpay accepts amount in paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: orderId,
        notes: {
          customerId,
          paymentMethod: 'Razorpay'
        }
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);
      
      // Create initial pending payment ledger record
      await Payment.create({
        id: paymentId,
        orderId,
        customerId,
        amount,
        paymentMethod: 'Razorpay',
        transactionReference: razorpayOrder.id,
        status: 'Pending'
      });

      console.log(`💳 [PAYMENT SERVICE] Razorpay order created successfully: ${razorpayOrder.id}`);
      return { 
        success: true, 
        isSimulated: false,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId
      };
    } catch (error) {
      console.error('🚨 [PAYMENT SERVICE] Razorpay Order Creation failed. Falling back to simulation:', error.message);
    }
  }

  // Fallback simulated payment flow
  try {
    const payment = await Payment.create({
      id: paymentId,
      orderId,
      customerId,
      amount,
      paymentMethod: 'UPI',
      upiId: upiId || 'eco@payupi',
      transactionReference: txnRef,
      status: 'Completed' // Auto-approved in mock environment
    });

    // Update order with payment details and advance status to Preparing
    await Order.findOneAndUpdate(
      { id: orderId },
      { $set: { paymentId, status: 'Preparing' } }
    );

    console.log(`💳 [PAYMENT SERVICE] Simulated UPI transaction completed for order ${orderId}. Ref: ${txnRef}`);
    return { success: true, isSimulated: true, payment };
  } catch (error) {
    console.error('🚨 [PAYMENT SERVICE] Payment simulation failed:', error.message);
    throw error;
  }
};

/**
 * Verifies Razorpay payment signature received from frontend.
 */
export const verifyRazorpayPayment = async (orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️ [PAYMENT SERVICE] Verification request received but RAZORPAY_KEY_SECRET is missing. Bypassing verification (Simulated Approval)...');
    
    // Auto-approve simulated Razorpay verification
    await Order.findOneAndUpdate({ id: orderId }, { $set: { status: 'Preparing' } });
    await Payment.findOneAndUpdate({ transactionReference: razorpayOrderId }, { $set: { status: 'Completed' } });
    return { success: true, verified: true, isSimulated: true };
  }

  try {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Note: Razorpay uses sha256
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (isSignatureValid) {
      console.log(`💳 [PAYMENT SERVICE] Razorpay signature verified successfully for order ${orderId}`);
      
      // Update Payment and Order status
      await Payment.findOneAndUpdate(
        { transactionReference: razorpayOrderId },
        { $set: { status: 'Completed' } }
      );

      await Order.findOneAndUpdate(
        { id: orderId },
        { $set: { status: 'Preparing' } }
      );

      return { success: true, verified: true };
    } else {
      console.error(`🚨 [PAYMENT SERVICE] Razorpay signature mismatch for order ${orderId}`);
      
      await Payment.findOneAndUpdate(
        { transactionReference: razorpayOrderId },
        { $set: { status: 'Failed' } }
      );

      return { success: false, verified: false, message: 'Invalid payment signature' };
    }
  } catch (error) {
    console.error('🚨 [PAYMENT SERVICE] Razorpay verification error:', error.message);
    throw error;
  }
};

