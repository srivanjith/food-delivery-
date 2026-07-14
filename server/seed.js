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
import Wallet from './models/Wallet.js';
import CoinHistory from './models/CoinHistory.js';
import PlatformRevenue from './models/PlatformRevenue.js';
import RestaurantSettlement from './models/RestaurantSettlement.js';
import AdminSettings from './models/AdminSettings.js';
import Category from './models/Category.js';
import Coupon from './models/Coupon.js';

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
      Review.deleteMany({}),
      Wallet.deleteMany({}),
      CoinHistory.deleteMany({}),
      PlatformRevenue.deleteMany({}),
      RestaurantSettlement.deleteMany({}),
      AdminSettings.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // 1. Seed AdminSettings
    console.log('Seeding Admin Settings...');
    const settings = await AdminSettings.create({
      commissionRate: 0.15,
      platformFee: 15,
      deliveryFeeRate: 30,
      rewardEarnRatio: 0.10,
      coinConversionRate: 100,
      maxCoinRedemptionLimit: 50
    });

    // 2. Seed Coupons
    console.log('Seeding discount coupons...');
    await Coupon.insertMany([
      { code: 'ECOEATS20', discountType: 'percentage', discountValue: 20, minOrderValue: 500, maxDiscount: 150 },
      { code: 'GREENFRIDAY', discountType: 'flat', discountValue: 100, minOrderValue: 300 },
      { code: 'FREECOMMUTE', discountType: 'free_delivery', discountValue: 0 }
    ]);

    // 3. Seed Categories
    console.log('Seeding global food categories...');
    const uniqueCategories = new Set();
    data.restaurants.forEach(r => r.categories.forEach(c => uniqueCategories.add(c)));
    const categoriesToInsert = Array.from(uniqueCategories).map(name => ({ name, active: true }));
    await Category.insertMany(categoriesToInsert);

    // 4. Seed Users and Wallets
    console.log('Seeding User profiles (hashing passwords)...');
    
    // Add restaurant manager profile dynamically
    if (!data.users.find(u => u.email === 'restaurant@ecoeats.com')) {
      data.users.push({
        id: "rest-owner-777",
        name: "Green Beanery Manager",
        email: "restaurant@ecoeats.com",
        password: "password",
        role: "restaurant",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        savedAddresses: [],
        ecoPoints: 0
      });
    }

    // Add delivery courier profile dynamically
    if (!data.users.find(u => u.email === 'delivery@ecoeats.com')) {
      data.users.push({
        id: "courier-888",
        name: "John Eco-Courier",
        email: "delivery@ecoeats.com",
        password: "password",
        role: "delivery",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        savedAddresses: [],
        ecoPoints: 150
      });
    }

    for (const u of data.users) {
      // Use save() to trigger bcrypt pre-save password hashing
      const user = new User({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        avatar: u.avatar,
        savedAddresses: u.savedAddresses,
        ecoPoints: u.ecoPoints
      });
      await user.save();

      // Create wallet linked to registered email
      await Wallet.create({
        holderId: u.id,
        holderEmail: u.email,
        holderType: u.role === 'admin' ? 'platform' : u.role === 'restaurant' ? 'restaurant' : u.role === 'delivery' ? 'delivery' : 'customer',
        coinBalance: u.ecoPoints || 0,
        fiatBalance: 0
      });
    }

    // 5. Seed Restaurants & Wallets
    console.log('Seeding Restaurant profiles...');
    for (const r of data.restaurants) {
      const rest = new Restaurant({
        id: r.id,
        ownerId: r.id === 'rest-1' ? 'rest-owner-777' : undefined,
        name: r.name,
        image: r.image,
        rating: r.rating,
        deliveryTime: r.deliveryTime,
        distance: r.distance,
        location: r.location,
        description: r.description,
        address: r.address,
        contact: r.contact || '+91 98765 43210',
        timings: r.timings || '09:00 AM - 10:00 PM',
        lat: r.lat,
        lng: r.lng,
        categories: r.categories,
        tags: r.tags,
        certifications: r.certifications,
        commissionRate: 0.15,
        active: true
      });
      await rest.save();

      // Create wallet
      await Wallet.create({
        holderId: r.id,
        holderType: 'restaurant',
        coinBalance: 0,
        fiatBalance: 0
      });
    }

    // 6. Seed Food Items
    console.log('Seeding Food menu items...');
    await FoodItem.insertMany(data.foodItems);

    // 7. Seed Reviews
    console.log('Seeding Reviews...');
    await Review.insertMany(data.reviews);

    // 8. Seed Orders, Coin History, and Platform Revenues (Calculated for delivered orders)
    console.log('Seeding Orders and pre-computing Platform Revenues & settlements...');
    for (const o of data.orders) {
      const order = new Order({
        id: o.id,
        date: o.date,
        restaurantName: o.restaurantName,
        restaurantId: o.restaurantId,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        items: o.items,
        subtotal: o.subtotal,
        packagingCharge: o.packagingCharge,
        deliveryCharge: o.deliveryCharge,
        gst: o.gst,
        total: o.total,
        packagingChoice: o.packagingChoice,
        deliveryMethod: o.deliveryMethod,
        address: o.address || 'Apartment 4B, Emerald Heights, Sector 4, Green Glen Layout, Bengaluru',
        status: o.status,
        coinsProcessed: true
      });

      // Calculate revenue and coins
      const coinsEarned = Math.round(o.subtotal * settings.rewardEarnRatio);
      const commissionEarned = Math.round(o.subtotal * settings.commissionRate);
      const platformFeeEarned = settings.platformFee;
      const coinCost = coinsEarned / settings.coinConversionRate;
      const netRevenue = (commissionEarned + platformFeeEarned) - coinCost;

      order.rewardCoinsEarned = coinsEarned;
      await order.save();

      // Save platform revenue ledger entry
      await PlatformRevenue.create({
        id: `rev-rec-${order.id}`,
        orderId: order.id,
        restaurantId: order.restaurantId,
        orderTotal: order.total,
        commissionEarned,
        platformFeeEarned,
        deliveryChargeEarned: order.deliveryCharge || 0,
        coinsValueCost: coinCost,
        netRevenue
      });

      // Add to restaurant wallet
      const restSettlementAmt = (order.subtotal + order.packagingCharge + order.gst) - commissionEarned;
      await Wallet.findOneAndUpdate(
        { holderId: order.restaurantId },
        { $inc: { fiatBalance: restSettlementAmt } }
      );

      // Create CoinHistory record for customer earning linked to registered email
      const customerId = 'user-888';
      await CoinHistory.create({
        id: `coin-txn-${order.id}`,
        userId: customerId,
        userEmail: order.customerEmail || 'user@ecoeats.com',
        orderId: order.id,
        type: 'earned',
        amount: coinsEarned,
        description: `Order delivery rewards for order ${order.id}`
      });
    }

    console.log('Database seeded and financial historical records generated successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
