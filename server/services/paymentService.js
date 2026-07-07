import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const processUPIPayment = async (orderId, customerId, amount, upiId) => {
  try {
    const paymentId = `pay-${Date.now()}`;
    const txnRef = `REF-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payment = await Payment.create({
      id: paymentId,
      orderId,
      customerId,
      amount,
      paymentMethod: 'UPI',
      upiId,
      transactionReference: txnRef,
      status: 'Completed' // Auto-approved for simulation
    });

    // Update order with payment details
    await Order.findOneAndUpdate(
      { id: orderId },
      { $set: { paymentId, status: 'Preparing' } }
    );

    console.log(`💳 [PAYMENT SYSTEM] UPI transaction completed for order ${orderId}. Ref: ${txnRef}`);
    return { success: true, payment };
  } catch (error) {
    console.error('🚨 [PAYMENT SERVICE] Payment creation failed:', error.message);
    throw error;
  }
};
