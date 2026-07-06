import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import FoodItem from './models/FoodItem.js';
import Order from './models/Order.js';
import Review from './models/Review.js';

dotenv.config();

const sendFeedbackEmail = async (order) => {
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
        return true;
      } else {
        const errorText = await response.text();
        console.error(`📧 [EMAILJS SYSTEM] Failed to send email via EmailJS:`, errorText);
        return false;
      }
    } else {
      console.log(`\n📧 [EMAILJS SYSTEM] EmailJS credentials not configured in .env. Simulated feedback email logged:`);
      console.log(`Recipient: ${payload.template_params.to_name} <${recipient}>`);
      console.log(`Subject: How was your sustainable dining experience from ${order.restaurantName}?`);
      console.log(`Order ID: ${order.id}`);
      console.log(`Link: http://localhost:5173/restaurant/${order.restaurantId}\n`);
      return false;
    }
  } catch (err) {
    console.error('📧 [EMAILJS SYSTEM] Error sending feedback email via EmailJS API:', err.message);
    return false;
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// 1. Restaurant Listing APIs
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Food Items Listing APIs
app.get('/api/food-items', async (req, res) => {
  try {
    const foodItems = await FoodItem.find({});
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. User Authentication & Profile APIs
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const userObj = user.toObject();
      delete userObj.password;
      res.json({ success: true, user: userObj });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newUser = await User.create({
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      savedAddresses: [],
      ecoPoints: 0
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  const { userId, savedAddresses, ecoPoints, name, avatar } = req.body;
  try {
    const updateFields = {};
    if (savedAddresses !== undefined) updateFields.savedAddresses = savedAddresses;
    if (ecoPoints !== undefined) updateFields.ecoPoints = ecoPoints;
    if (name !== undefined) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateFields },
      { new: true }
    );

    if (updatedUser) {
      const userObj = updatedUser.toObject();
      delete userObj.password;
      res.json({ success: true, user: userObj });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Order Management APIs
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await Order.create(orderData);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    );
    if (updatedOrder) {
      let emailSent = false;
      const recipient = updatedOrder.customerEmail || 'user@ecoeats.com';
      
      if (status === 'Delivered') {
        emailSent = await sendFeedbackEmail(updatedOrder);
      }
      
      res.json({ 
        success: true, 
        order: updatedOrder, 
        emailSent, 
        recipient 
      });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Reviews APIs
app.get('/api/reviews', async (req, res) => {
  const { restaurantId } = req.query;
  try {
    const query = restaurantId ? { restaurantId } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const reviewData = req.body;
  try {
    const newReview = await Review.create({
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Admin Restaurant APIs
app.post('/api/restaurants', async (req, res) => {
  const restaurantData = req.body;
  try {
    const newRest = await Restaurant.create({
      ...restaurantData,
      id: `rest-${Date.now()}`,
      rating: 5.0,
      distance: parseFloat((Math.random() * 4 + 0.5).toFixed(1))
    });
    res.status(201).json({ success: true, restaurant: newRest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const updatedRest = req.body;
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { id },
      { $set: updatedRest },
      { new: true }
    );
    if (updated) {
      res.json({ success: true, restaurant: updated });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Restaurant.deleteOne({ id });
    await FoodItem.deleteMany({ restaurantId: id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Admin Food Item APIs
app.post('/api/food-items', async (req, res) => {
  const itemData = req.body;
  try {
    const newItem = await FoodItem.create({
      ...itemData,
      id: `food-${Date.now()}`,
      rating: 5.0
    });
    res.status(201).json({ success: true, foodItem: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/food-items/:id', async (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  try {
    const updated = await FoodItem.findOneAndUpdate(
      { id },
      { $set: updatedItem },
      { new: true }
    );
    if (updated) {
      res.json({ success: true, foodItem: updated });
    } else {
      res.status(404).json({ success: false, message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/food-items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await FoodItem.deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`EcoEats server is running on http://localhost:${PORT}`);
});
// Nodemon restart trigger (2)
