import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const sendFeedbackEmail = async (order) => {
  const recipient = order.customerEmail || 'user@ecoeats.com';
  
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"EcoEats Support" <support@ecoeats.com>`;

  const feedbackLink = `http://localhost:5173/restaurant/${order.restaurantId}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2e7d32; text-align: center;">🌱 Thank you for your eco-friendly dining choice!</h2>
      <p>Hello <strong>${order.customerName || 'Eco-Citizen'}</strong>,</p>
      <p>We hope you enjoyed your meal from <strong>${order.restaurantName}</strong>.</p>
      <div style="background-color: #f1f8e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #33691e;">Order Details</h4>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Packaging Choice:</strong> ${order.packagingChoice || 'Compostable packaging'}</li>
          <li><strong>Delivery Method:</strong> ${order.deliveryMethod || 'Bicycle'}</li>
        </ul>
      </div>
      <p>Your choices make a difference. Please rate your experience and help others choose sustainably!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${feedbackLink}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Rate & Review Restaurant</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888; text-align: center;">EcoEats - Eating green, living clean.</p>
    </div>
  `;

  // 1. EmailJS API integration (if configured)
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (
    serviceId && serviceId !== 'your_service_id' &&
    templateId && templateId !== 'your_template_id' &&
    publicKey && publicKey !== 'your_public_key'
  ) {
    try {
      console.log(`📧 [EMAIL SERVICE] Sending email to ${recipient} via EmailJS API...`);
      const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_name: order.customerName || 'Eco-Citizen',
          to_email: recipient,
          order_id: order.id,
          restaurant_name: order.restaurantName,
          delivery_method: order.deliveryMethod || 'Bicycle',
          packaging_choice: order.packagingChoice || 'compostable packaging',
          feedback_link: feedbackLink
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`📧 [EMAIL SERVICE] Email successfully sent to ${recipient} via EmailJS.`);
        return { success: true, recipient, method: 'emailjs' };
      } else {
        const errorText = await response.text();
        console.error(`📧 [EMAIL SERVICE] EmailJS API failure:`, errorText);
      }
    } catch (err) {
      console.error(`🚨 [EMAIL SERVICE] EmailJS API error:`, err.message);
    }
  }

  // 2. If SMTP is configured, send using Nodemailer
  if (smtpHost && smtpUser && smtpPass) {
    try {
      console.log(`📧 [EMAIL SERVICE] Sending email to ${recipient} via Nodemailer SMTP...`);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: recipient,
        subject: `How was your sustainable dining experience from ${order.restaurantName}?`,
        html: emailHtml,
        text: `Hello ${order.customerName || 'Eco-Citizen'},\n\nThank you for choosing EcoEats! How was your meal from ${order.restaurantName}? Leave a review here: ${feedbackLink}`
      });

      console.log(`📧 [EMAIL SERVICE] Email successfully sent! Message ID: ${info.messageId}`);
      return { success: true, recipient, method: 'smtp', messageId: info.messageId };
    } catch (error) {
      console.error(`🚨 [EMAIL SERVICE] Nodemailer SMTP failed:`, error.message);
      // Fallback to other methods
    }
  }

  // 3. Fallback to console logs
  console.log(`\n📧 [EMAIL SERVICE] Simulated feedback email logged (no SMTP or EmailJS config):`);
  console.log(`From: ${smtpFrom || 'support@ecoeats.com'}`);
  console.log(`Recipient: ${order.customerName || 'Eco-Citizen'} <${recipient}>`);
  console.log(`Subject: How was your sustainable dining experience from ${order.restaurantName}?`);
  console.log(`Order ID: ${order.id}`);
  console.log(`Link: ${feedbackLink}\n`);
  return { success: true, simulated: true, recipient };
};

