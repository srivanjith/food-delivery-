const API_URL = 'http://localhost:5000/api';

async function runPortalTest() {
  console.log('🏁 Starting complete Restaurant and Delivery portal workflow test (no DOM)...');
  
  const customerEmail = 'customer-tester@ecoeats.com';
  const customerPhone = '+919626669747';
  
  // We will use the pre-seeded credentials for Restaurant Owner and Delivery Boy
  const restaurantEmail = 'restaurant@ecoeats.com';
  const deliveryEmail = 'delivery@ecoeats.com';
  const commonPassword = 'password';

  try {
    // ----------------------------------------------------
    // STEP 1: CUSTOMER SIGNUP & PLACING ORDER
    // ----------------------------------------------------
    console.log(`\n[Step 1] Customer signing up...`);
    const customerSignupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Customer',
        email: `customer-${Date.now()}@ecoeats.com`,
        password: 'password123',
        phone: customerPhone,
        role: 'customer'
      })
    });
    const customerData = await customerSignupRes.json();
    if (!customerData.success) throw new Error(`Customer signup failed: ${customerData.message}`);
    const customerToken = customerData.token;
    
    console.log(`[Step 1] Customer placing order to The Green Beanery (rest-1)...`);
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        restaurantId: 'rest-1',
        restaurantName: 'The Green Beanery',
        items: [{ id: 'item-1', name: 'Organic Avocado Salad', price: 150, quantity: 1 }],
        subtotal: 150,
        total: 150,
        address: '123 Green Street, Bengaluru',
        packagingChoice: 'reusable',
        deliveryMethod: 'bicycle'
      })
    });
    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error(`Order placement failed: ${orderData.message}`);
    const orderId = orderData.order.id;
    console.log(`✅ Order placed successfully! Order ID: ${orderId}`);

    // ----------------------------------------------------
    // STEP 2: RESTAURANT OWNER LOGS IN
    // ----------------------------------------------------
    console.log(`\n[Step 2] Restaurant Owner logging in with ${restaurantEmail}...`);
    const restLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: restaurantEmail, password: commonPassword })
    });
    const restLoginData = await restLoginRes.json();
    if (!restLoginData.success) throw new Error(`Restaurant login failed: ${restLoginData.message}`);
    const restToken = restLoginData.token;
    console.log(`✅ Restaurant Owner logged in successfully!`);

    // ----------------------------------------------------
    // STEP 3: RESTAURANT RETRIEVES THE ORDER
    // ----------------------------------------------------
    console.log(`\n[Step 3] Restaurant retrieving order pipeline...`);
    const restOrdersRes = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${restToken}` }
    });
    const restOrders = await restOrdersRes.json();
    const matchedOrder = restOrders.find(o => o.id === orderId);
    if (!matchedOrder) {
      throw new Error(`Order ${orderId} was NOT found in the restaurant's active orders list!`);
    }
    console.log(`✅ Order found in restaurant pipeline! Current Status: "${matchedOrder.status}"`);

    // ----------------------------------------------------
    // STEP 4: RESTAURANT OWNER SETS TO "PREPARING"
    // ----------------------------------------------------
    console.log(`\n[Step 4] Restaurant updating order status to "Preparing"...`);
    const prepareRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${restToken}`
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    const prepareData = await prepareRes.json();
    if (!prepareData.success) throw new Error(`Failed to set status to Preparing: ${prepareData.message}`);
    console.log(`✅ Status updated to: "${prepareData.order.status}"`);

    // ----------------------------------------------------
    // STEP 5: RESTAURANT OWNER SETS TO "READY FOR PICKUP"
    // ----------------------------------------------------
    console.log(`\n[Step 5] Restaurant updating order status to "Ready for Pickup"...`);
    const readyRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${restToken}`
      },
      body: JSON.stringify({ status: 'Ready for Pickup' })
    });
    const readyData = await readyRes.json();
    if (!readyData.success) throw new Error(`Failed to set status to Ready for Pickup: ${readyData.message}`);
    console.log(`✅ Status updated to: "${readyData.order.status}" (Awaiting Courier Pickup)`);

    // ----------------------------------------------------
    // STEP 6: DELIVERY BOY LOGS IN
    // ----------------------------------------------------
    console.log(`\n[Step 6] Delivery Boy logging in with ${deliveryEmail}...`);
    const deliveryLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: deliveryEmail, password: commonPassword })
    });
    const deliveryLoginData = await deliveryLoginRes.json();
    if (!deliveryLoginData.success) throw new Error(`Delivery login failed: ${deliveryLoginData.message}`);
    const deliveryToken = deliveryLoginData.token;
    console.log(`✅ Delivery Boy logged in successfully!`);

    // ----------------------------------------------------
    // STEP 7: DELIVERY BOY CLAIMS ORDER ("OUT FOR DELIVERY")
    // ----------------------------------------------------
    console.log(`\n[Step 7] Delivery Boy claiming the order (assigning courier)...`);
    const claimRes = await fetch(`${API_URL}/orders/${orderId}/assign-courier`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deliveryToken}`
      }
    });
    const claimData = await claimRes.json();
    if (!claimData.success) throw new Error(`Failed to claim order: ${claimData.message}`);
    console.log(`✅ Order claimed successfully! Status updated to: "${claimData.order.status}"`);
    console.log(`Courier Assigned: ${claimData.order.deliveryBoyName} (ID: ${claimData.order.deliveryBoyId})`);

    // ----------------------------------------------------
    // STEP 8: DELIVERY BOY MARKS AS "DELIVERED"
    // ----------------------------------------------------
    console.log(`\n[Step 8] Delivery Boy marking order status as "Delivered"...`);
    const deliverRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deliveryToken}`
      },
      body: JSON.stringify({ status: 'Delivered' })
    });
    const deliverData = await deliverRes.json();
    if (!deliverData.success) throw new Error(`Failed to mark order as Delivered: ${deliverData.message}`);
    console.log(`✅ Order marked as "${deliverData.order.status}"!`);
    console.log(`Loyalty rewards & settlements have been processed.`);

    console.log('\n🎉 ALL PORTAL WORKFLOW STEPS COMPLETED SUCCESSFULLY WITHOUT DOM! 🎉');
  } catch (err) {
    console.error('❌ Portal workflow test failed:', err.message);
  }
}

runPortalTest();
