import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

async function diagnose() {
  console.log('🔍 Running Twilio SMS Diagnostics...');

  if (!accountSid || !authToken) {
    console.error('❌ Error: Twilio credentials are missing in your .env file!');
    return;
  }

  const client = twilio(accountSid, authToken);

  try {
    console.log('Fetching recent SMS message logs from your Twilio account...\n');
    const messages = await client.messages.list({ limit: 5 });

    if (messages.length === 0) {
      console.log('❓ No messages found in your Twilio history.');
      return;
    }

    console.log('==================================================');
    messages.forEach((msg) => {
      console.log(`💬 Message SID: ${msg.sid}`);
      console.log(`   To:          ${msg.to}`);
      console.log(`   From:        ${msg.from}`);
      console.log(`   Status:      ${msg.status.toUpperCase()}`);
      console.log(`   Date Sent:   ${msg.dateSent || msg.dateCreated}`);
      console.log(`   Error Code:  ${msg.errorCode ? '❌ ' + msg.errorCode : '✅ None'}`);
      console.log(`   Error Msg:   ${msg.errorMessage || 'None'}`);
      console.log(`   Text:        "${msg.body}"`);
      console.log('--------------------------------------------------');
    });
    console.log('==================================================');

    console.log('\n💡 Diagnostic Tips based on status:');
    console.log('• If status is "SENT" but not received: The carrier (Jio/Airtel) has blocked it due to DND or DLT registration requirements.');
    console.log('• If status is "FAILED" or "UNDELIVERED": Look at the Error Code. Common codes:');
    console.log('   - 30007: Carrier Filter (blocked by Indian telecom firewall).');
    console.log('   - 21608: Sending to unverified number (trial account limitation).');
    console.log('   - 21408: Geo-permission blocked (Enable India geo-permissions in Twilio console).');
  } catch (error) {
    console.error('🚨 Error querying Twilio API:', error.message);
  }
}

diagnose();
