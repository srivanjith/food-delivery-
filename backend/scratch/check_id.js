import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const rest = await Restaurant.findOne({ ownerId: 'rest-owner-777' });
  if (rest) {
    console.log('Using rest.id:', rest.id);
    console.log("Using rest.get('id'):", rest.get('id'));
    console.log('Using rest._id:', rest._id);
    console.log("Using rest.get('id', null, { getters: false }):", rest.get('id', null, { getters: false }));
    console.log('Using rest.toObject().id:', rest.toObject().id);
    console.log('Using rest._doc.id:', rest._doc ? rest._doc.id : 'N/A');
  } else {
    console.log('Restaurant not found');
  }

  await mongoose.disconnect();
}
check();
