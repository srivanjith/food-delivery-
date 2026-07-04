import express from 'express';
import cors from 'cors';
import { getData, saveData } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Restaurant Listing APIs
app.get('/api/restaurants', async (req, res) => {
  const db = await getData();
  res.json(db.restaurants || []);
});

// 2. Food Items Listing APIs
app.get('/api/food-items', async (req, res) => {
  const db = await getData();
  res.json(db.foodItems || []);
});

// 3. User Authentication & Profile APIs
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await getData();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const db = await getData();
  
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: 'customer',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
    savedAddresses: [],
    ecoPoints: 0
  };

  db.users.push(newUser);
  await saveData(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, user: userWithoutPassword });
});

app.put('/api/auth/profile', async (req, res) => {
  const { userId, savedAddresses, ecoPoints } = req.body;
  const db = await getData();
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    if (savedAddresses !== undefined) {
      db.users[userIndex].savedAddresses = savedAddresses;
    }
    if (ecoPoints !== undefined) {
      db.users[userIndex].ecoPoints = ecoPoints;
    }
    
    await saveData(db);
    const { password: __, ...userWithoutPassword } = db.users[userIndex];
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// 4. Order Management APIs
app.get('/api/orders', async (req, res) => {
  const db = await getData();
  res.json(db.orders || []);
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  const db = await getData();
  
  if (!db.orders) db.orders = [];
  db.orders.unshift(order);
  await saveData(db);
  
  res.status(201).json({ success: true, order });
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await getData();
  
  const orderIndex = db.orders.findIndex(o => o.id === id);
  if (orderIndex !== -1) {
    db.orders[orderIndex].status = status;
    await saveData(db);
    res.json({ success: true, order: db.orders[orderIndex] });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// 5. Reviews APIs
app.get('/api/reviews', async (req, res) => {
  const { restaurantId } = req.query;
  const db = await getData();
  let reviews = db.reviews || [];
  
  if (restaurantId) {
    reviews = reviews.filter(r => r.restaurantId === restaurantId);
  }
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const review = req.body;
  const db = await getData();
  
  if (!db.reviews) db.reviews = [];
  
  const newReview = {
    id: `rev-${Date.now()}`,
    ...review,
    date: new Date().toISOString().split('T')[0]
  };
  
  db.reviews.push(newReview);
  await saveData(db);
  
  res.status(201).json({ success: true, review: newReview });
});

// 6. Admin Restaurant APIs
app.post('/api/restaurants', async (req, res) => {
  const restaurant = req.body;
  const db = await getData();
  
  const newRest = {
    ...restaurant,
    id: `rest-${Date.now()}`,
    rating: 5.0,
    distance: parseFloat((Math.random() * 4 + 0.5).toFixed(1))
  };

  db.restaurants.push(newRest);
  await saveData(db);
  res.status(201).json({ success: true, restaurant: newRest });
});

app.put('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const updatedRest = req.body;
  const db = await getData();
  
  const idx = db.restaurants.findIndex(r => r.id === id);
  if (idx !== -1) {
    db.restaurants[idx] = { ...db.restaurants[idx], ...updatedRest };
    await saveData(db);
    res.json({ success: true, restaurant: db.restaurants[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Restaurant not found' });
  }
});

app.delete('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getData();
  
  db.restaurants = db.restaurants.filter(r => r.id !== id);
  db.foodItems = db.foodItems.filter(f => f.restaurantId !== id);
  
  await saveData(db);
  res.json({ success: true });
});

// 7. Admin Food Item APIs
app.post('/api/food-items', async (req, res) => {
  const item = req.body;
  const db = await getData();
  
  const newItem = {
    ...item,
    id: `food-${Date.now()}`,
    rating: 5.0
  };

  db.foodItems.push(newItem);
  await saveData(db);
  res.status(201).json({ success: true, foodItem: newItem });
});

app.put('/api/food-items/:id', async (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const db = await getData();
  
  const idx = db.foodItems.findIndex(f => f.id === id);
  if (idx !== -1) {
    db.foodItems[idx] = { ...db.foodItems[idx], ...updatedItem };
    await saveData(db);
    res.json({ success: true, foodItem: db.foodItems[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Food item not found' });
  }
});

app.delete('/api/food-items/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getData();
  
  db.foodItems = db.foodItems.filter(f => f.id !== id);
  await saveData(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`EcoEats server is running on http://localhost:${PORT}`);
});
