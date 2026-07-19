import dotenv from 'dotenv';
dotenv.config();

console.log('\n======================================');
console.log('🔍 Checking Environment Variables (.env)');
console.log('======================================');
console.log(`PORT: ${process.env.PORT || 'Undefined (Default: 5000)'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing'}`);
console.log(`EMAILJS_SERVICE_ID: ${process.env.EMAILJS_SERVICE_ID || '❌ Missing'}`);
console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Loaded' : '❌ Commented out or missing'}`);
console.log(`TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? '✅ Loaded' : '❌ Commented out or missing'}`);
console.log(`TWILIO_PHONE_NUMBER: ${process.env.TWILIO_PHONE_NUMBER ? '✅ Loaded' : '❌ Commented out or missing'}`);
console.log(`TWILIO_TEST_RECIPIENT: ${process.env.TWILIO_TEST_RECIPIENT ? '✅ Loaded' : '❌ Commented out or missing'}`);
console.log('======================================\n');
