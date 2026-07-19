const API_URL = 'http://localhost:5000/api';

async function runTest() {
  console.log('🏁 Starting complete project workflow test (no DOM)...');
  const timestamp = Date.now();
  const testEmail = `tester-${timestamp}@ecoeats.com`;
  const testPhone = '7867808182'; // Newly verified number in Twilio console

  try {
    // 1. SIGNUP WITH EMAIL AND PHONE NUMBER
    console.log(`\nStep 1: Signing up user with email: ${testEmail} and phone: ${testPhone}`);
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe Tester',
        email: testEmail,
        password: 'password123',
        phone: testPhone,
        role: 'customer'
      })
    });

    const signupData = await signupRes.json();
    if (!signupData.success) {
      throw new Error(`Signup failed: ${signupData.message}`);
    }
    console.log('✅ Signup successful!');
    console.log('User saved to DB:', {
      id: signupData.user.id,
      name: signupData.user.name,
      email: signupData.user.email,
      phone: signupData.user.phone
    });

    const token = signupData.token;

    // 2. PLACE ORDER USING JWT TOKEN
    console.log('\nStep 2: Placing order with the authenticated token...');
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurantId: 'rest-1',
        restaurantName: 'The Green Beanery',
        items: [
          { id: 'item-1', name: 'Organic Avocado Salad', price: 150, quantity: 2 }
        ],
        subtotal: 300,
        packagingCharge: 15,
        deliveryCharge: 30,
        gst: 15,
        total: 360,
        packagingChoice: 'reusable',
        deliveryMethod: 'bicycle',
        address: '456 Eco Avenue, Clean City'
      })
    });

    const orderData = await orderRes.json();
    if (!orderData.success) {
      throw new Error(`Order placement failed: ${orderData.message}`);
    }
    
    console.log('✅ Order placed successfully!');
    console.log('Order registered in DB:', {
      id: orderData.order.id,
      restaurantName: orderData.order.restaurantName,
      customerEmail: orderData.order.customerEmail,
      customerPhone: orderData.order.customerPhone,
      total: orderData.order.total
    });

    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

runTest();
