import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import FoodItem from './models/FoodItem.js';
import Order from './models/Order.js';
import Review from './models/Review.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, 'db.json');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    const fileContent = await fs.readFile(dbJsonPath, 'utf8');
    const data = JSON.parse(fileContent);

    // Clear existing
    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      FoodItem.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({})
    ]);

    // Insert new
    console.log('Inserting seed records into MongoDB...');
    await Promise.all([
      User.insertMany(data.users),
      Restaurant.insertMany(data.restaurants),
      FoodItem.insertMany(data.foodItems),
      Order.insertMany(data.orders),
      Review.insertMany(data.reviews)
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
