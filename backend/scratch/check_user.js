import mongoose from 'mongoose';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find({ email: 'restaurant@ecoeats.com' });
  console.log('\n--- USERS matching restaurant@ecoeats.com ---');
  users.forEach(u => {
    console.log(`User ID: ${u.id} | Name: ${u.name} | _id: ${u._id}`);
  });

  const rests = await Restaurant.find({ name: 'The Green Beanery' });
  console.log('\n--- RESTAURANTS matching The Green Beanery ---');
  rests.forEach(r => {
    console.log(`Restaurant ID: ${r.id} | Owner ID: ${r.ownerId} | _id: ${r._id}`);
  });

  const orders = await Order.find({ restaurantName: 'The Green Beanery' });
  console.log(`\n--- ORDERS for The Green Beanery (Total: ${orders.length}) ---`);
  orders.forEach(o => {
    console.log(`Order ID: ${o.id} | Restaurant ID: ${o.restaurantId} | Status: ${o.status}`);
  });

  await mongoose.disconnect();
}
check();
