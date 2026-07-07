import dotenv from 'dotenv';
dotenv.config();

export const sendFeedbackEmail = async (order) => {
  const recipient = order.customerEmail || 'user@ecoeats.com';
  
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_name: order.customerName || 'Eco-Citizen',
      to_email: recipient,
      order_id: order.id,
      restaurant_name: order.restaurantName,
      delivery_method: order.deliveryMethod || 'Bicycle',
      packaging_choice: order.packagingChoice || 'compostable packaging',
      feedback_link: `http://localhost:5173/restaurant/${order.restaurantId}`
    }
  };

  try {
    if (
      payload.service_id && payload.service_id !== 'your_service_id' &&
      payload.template_id && payload.template_id !== 'your_template_id' &&
      payload.user_id && payload.user_id !== 'your_public_key'
    ) {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`📧 [EMAILJS SYSTEM] Real email successfully sent to ${recipient}`);
        return { success: true, recipient };
      } else {
        const errorText = await response.text();
        console.error(`📧 [EMAILJS SYSTEM] Failed to send email via EmailJS:`, errorText);
        return { success: false, error: errorText };
      }
    } else {
      console.log(`\n📧 [EMAILJS SYSTEM] EmailJS credentials not configured in .env. Simulated feedback email logged:`);
      console.log(`Recipient: ${payload.template_params.to_name} <${recipient}>`);
      console.log(`Subject: How was your sustainable dining experience from ${order.restaurantName}?`);
      console.log(`Order ID: ${order.id}`);
      console.log(`Link: http://localhost:5173/restaurant/${order.restaurantId}\n`);
      return { success: true, simulated: true, recipient };
    }
  } catch (err) {
    console.error('📧 [EMAILJS SYSTEM] Error sending feedback email via EmailJS API:', err.message);
    return { success: false, error: err.message };
  }
};
