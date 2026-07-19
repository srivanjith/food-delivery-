import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find({});
  console.log('--- USERS ---');
  users.forEach(u => console.log(`User: ${u.name} | Email: ${u.email} | Role: ${u.role} | ID: ${u.id}`));

  const rests = await Restaurant.find({});
  console.log('--- RESTAURANTS ---');
  rests.forEach(r => console.log(`Rest: ${r.name} | ID: ${r.id} | OwnerId: ${r.ownerId}`));

  const orders = await Order.find({});
  console.log('--- ORDERS ---');
  orders.forEach(o => console.log(`Order: ${o.id} | RestId: ${o.restaurantId} | RestName: ${o.restaurantName} | Status: ${o.status}`));

  await mongoose.disconnect();
}
check();
