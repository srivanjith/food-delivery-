import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

/**
 * Sends an SMS notification to the customer.
 * If Twilio is not configured, it falls back to simulated console logs.
 * 
 * @param {Object} order - The order object.
 * @param {string} recipientPhone - The user's phone number.
 * @returns {Promise<Object>} The status of the SMS delivery.
 */
export const sendSMSNotification = async (order, recipientPhone) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const testRecipient = process.env.TWILIO_TEST_RECIPIENT;

  // Determine target phone number:
  // Use recipient's phone if provided, otherwise fallback to the developer's test recipient from env.
  let targetPhone = recipientPhone || testRecipient;

  // Normalize phone number to standard E.164 format
  if (targetPhone) {
    targetPhone = targetPhone.trim().replace(/[\s\-()]+/g, ''); // Remove spaces, dashes, parentheses
    if (!targetPhone.startsWith('+')) {
      if (targetPhone.length === 10) {
        targetPhone = `+91${targetPhone}`; // Prepend +91 for 10-digit Indian numbers
      } else if (targetPhone.startsWith('91') && targetPhone.length === 12) {
        targetPhone = `+${targetPhone}`; // Prepend + for numbers starting with 91 but lacking +
      }
    }
  }

  const orderId = order.id;
  const total = order.total;
  const restaurantName = order.restaurantName;

  const smsText = `Your order of ₹${total} has been successfully placed to ${restaurantName}. Order ID: ${orderId}. Thank you for choosing EcoEats! 🌿`;

  // 1. If Twilio credentials and recipient are configured, send a real SMS
  if (accountSid && authToken && twilioPhone && targetPhone) {
    try {
      console.log(`📱 [SMS SERVICE] Sending real SMS to ${targetPhone} via Twilio...`);
      const client = twilio(accountSid, authToken);

      const message = await client.messages.create({
        body: smsText,
        from: twilioPhone,
        to: targetPhone
      });

      console.log(`📱 [SMS SERVICE] SMS sent successfully! Message SID: ${message.sid}`);
      return { success: true, method: 'twilio', sid: message.sid, recipient: targetPhone };
    } catch (error) {
      console.error(`🚨 [SMS SERVICE] Twilio API call failed:`, error.message);
      // Fail back to simulation so order placement doesn't crash
    }
  }

  // 2. Fallback to server logs for developer testing
  console.log(`\n📱 [SMS SERVICE] Simulated SMS logged (no Twilio config or phone number):`);
  console.log(`To: ${targetPhone || 'NO_PHONE_NUMBER_SPECIFIED'}`);
  console.log(`From: ${twilioPhone || 'EcoEats (Simulated)'}`);
  console.log(`Message: "${smsText}"\n`);

  return { success: true, simulated: true, recipient: targetPhone || 'none' };
};
