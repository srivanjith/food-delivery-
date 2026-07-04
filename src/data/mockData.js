export const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'The Green Beanery',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    deliveryTime: '15-25',
    distance: 1.2, // in km
    location: 'Green Glen Layout',
    ecoScore: 'A+',
    carbonFootprintAvg: 110, // in grams CO2e
    carbonOffsetAvg: 90, // percent offset
    categories: ['Vegan', 'Organic', 'Locally Sourced'],
    description: '100% plant-based food crafted from locally grown organic vegetables. We practice complete compostable packaging and zero waste kitchen policies.',
    address: '102, Emerald Plaza, Sector 4, Green Glen Layout, Bengaluru',
    lat: 12.9279,
    lng: 77.6826,
    tags: ['Salads', 'Bowls', 'Smoothies', 'Healthy'],
    certifications: ['Plastic Free', 'Carbon Neutral', 'Organic Certified']
  },
  {
    id: 'rest-2',
    name: 'Roots & Shoots Cafe',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    deliveryTime: '20-30',
    distance: 2.5,
    location: 'HSR Layout',
    ecoScore: 'A',
    carbonFootprintAvg: 160,
    carbonOffsetAvg: 80,
    categories: ['Organic', 'Locally Sourced', 'Vegetarian'],
    description: 'A charming farm-to-table bistro sourcing 90% of our ingredients within a 50km radius. Serving delicious wholesome vegetarian plates.',
    address: '45, 17th Cross, Sector 3, HSR Layout, Bengaluru',
    lat: 12.9105,
    lng: 77.6450,
    tags: ['Burgers', 'Pasta', 'Coffee', 'Desserts'],
    certifications: ['90% Local Ingredients', 'Compostable Only']
  },
  {
    id: 'rest-3',
    name: 'Zero Waste Bistro',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    deliveryTime: '25-35',
    distance: 3.1,
    location: 'Koramangala',
    ecoScore: 'A+',
    carbonFootprintAvg: 95,
    carbonOffsetAvg: 95,
    categories: ['Zero Waste', 'Vegan', 'Locally Sourced'],
    description: 'Pioneers of circular dining. Every single ingredient is used entirely, leftovers are composted in-house, and delivery is packed in returnable stainless steel tiffins.',
    address: '562, 80 Feet Road, 4th Block, Koramangala, Bengaluru',
    lat: 12.9343,
    lng: 77.6148,
    tags: ['Bowls', 'Soups', 'Wraps', 'Cold-Pressed Juices'],
    certifications: ['Zero Waste Certified', '100% Biodegradable', 'B-Corp']
  },
  {
    id: 'rest-4',
    name: 'Re-Bake Artisan Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    deliveryTime: '10-20',
    distance: 0.8,
    location: 'Green Glen Layout',
    ecoScore: 'A',
    carbonFootprintAvg: 125,
    carbonOffsetAvg: 85,
    categories: ['Surplus Rescue', 'Organic'],
    description: 'Premium organic sourdough and French pastries. We list our fresh, unsold surplus baked goods here daily to combat commercial food waste.',
    address: 'Shop 4, Willow Heights, Green Glen Layout, Bengaluru',
    lat: 12.9250,
    lng: 77.6850,
    tags: ['Sourdough', 'Pastries', 'Cakes', 'Breakfast'],
    certifications: ['Waste Warrior Partner', 'Organic Flour Certified']
  },
  {
    id: 'rest-5',
    name: 'The Conscious Carnivore',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    deliveryTime: '30-40',
    distance: 4.2,
    location: 'Indiranagar',
    ecoScore: 'B',
    carbonFootprintAvg: 580, // Higher footprint due to ethical meat, but we offset!
    carbonOffsetAvg: 60,
    categories: ['Locally Sourced', 'Carbon Offset'],
    description: 'We serve organic, free-range, grass-fed meats sourced from local sustainable farms. To offset the high carbon cost of meat, we plant a tree for every 3 meals ordered.',
    address: '782, 100 Feet Road, Indiranagar, Bengaluru',
    lat: 12.9719,
    lng: 77.6412,
    tags: ['Steaks', 'Grills', 'Burgers', 'Salads'],
    certifications: ['Grass-Fed Certified', '100% Free-Range', 'Tree-Planter Partner']
  },
  {
    id: 'rest-6',
    name: 'Nectar Juices & Bowls',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    deliveryTime: '15-25',
    distance: 1.8,
    location: 'HSR Layout',
    ecoScore: 'A',
    carbonFootprintAvg: 80,
    carbonOffsetAvg: 90,
    categories: ['Vegan', 'Organic', 'Surplus Rescue'],
    description: 'Cold-pressed juices and vibrant acai bowls using imperfect fruits that supermarket chains reject, preventing agricultural waste.',
    address: '22, 24th Main Road, Sector 2, HSR Layout, Bengaluru',
    lat: 12.9110,
    lng: 77.6520,
    tags: ['Juices', 'Acai Bowls', 'Salads', 'Vegan Desserts'],
    certifications: ['Imperfect Food Partner', 'Water-Conserving Prep']
  }
];

export const FOOD_ITEMS = [
  // The Green Beanery (rest-1)
  {
    id: 'food-101',
    restaurantId: 'rest-1',
    name: 'Organic Avocabo Green Salad',
    price: 320,
    description: 'Fresh organic Haas avocado, baby spinach, cucumbers, heirloom cherry tomatoes, pumpkin seeds, tossed in a house-made lemon-herb vinaigrette.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    carbonFootprint: 85, // g CO2e
    organic: true,
    vegan: true,
    localSourced: true,
    popular: true,
    ecoScore: 'A+'
  },
  {
    id: 'food-102',
    restaurantId: 'rest-1',
    name: 'Quinoa Eco-Buddha Bowl',
    price: 360,
    description: 'Roasted sweet potato, tri-color organic quinoa, steamed edamame, organic beet hummus, broccoli florets, and a creamy tahini drizzle.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    carbonFootprint: 110,
    organic: true,
    vegan: true,
    localSourced: true,
    popular: true,
    ecoScore: 'A+'
  },
  {
    id: 'food-103',
    restaurantId: 'rest-1',
    name: 'Detoxifying Green Smoothie',
    price: 190,
    description: 'Cold-blended organic kale, Granny Smith apples, ginger, mint leaves, chia seeds, and raw local honey.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    carbonFootprint: 60,
    organic: true,
    vegan: false, // Contains honey
    localSourced: true,
    popular: false,
    ecoScore: 'A'
  },

  // Roots & Shoots (rest-2)
  {
    id: 'food-201',
    restaurantId: 'rest-2',
    name: 'Lentil & Walnut Veggie Burger',
    price: 280,
    description: 'House-made brown lentil & walnut patty, organic cheddar cheese, caramelized onions, local butterhead lettuce, served on a whole-wheat bun.',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    carbonFootprint: 175,
    organic: true,
    vegan: false, // contains dairy
    localSourced: true,
    popular: true,
    ecoScore: 'A'
  },
  {
    id: 'food-202',
    restaurantId: 'rest-2',
    name: 'Wild Mushroom Truffle Pasta',
    price: 420,
    description: 'Sautéed local oyster and shiitake mushrooms, hand-rolled fettuccine, white truffle oil, and shaved vegan parmesan.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    carbonFootprint: 190,
    organic: false,
    vegan: true,
    localSourced: true,
    popular: true,
    ecoScore: 'A'
  },

  // Zero Waste Bistro (rest-3)
  {
    id: 'food-301',
    restaurantId: 'rest-3',
    name: 'Upcycled Cauliflower Rice Bowl',
    price: 290,
    description: 'Rice made from grated surplus cauliflower stems, grilled organic tofu, spiced chickpeas, pickled red onions, and herb chimichurri.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    carbonFootprint: 75,
    organic: true,
    vegan: true,
    localSourced: true,
    popular: true,
    ecoScore: 'A+'
  },
  {
    id: 'food-302',
    restaurantId: 'rest-3',
    name: 'Immunity Ginger Soup',
    price: 180,
    description: 'Warm, slow-simmered vegetable broth made from organic veggie trims, infused with high-grade ginger, turmeric, and lemongrass.',
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    carbonFootprint: 50,
    organic: true,
    vegan: true,
    localSourced: true,
    popular: false,
    ecoScore: 'A+'
  },

  // Re-Bake Artisan Bakery (rest-4)
  {
    id: 'food-401',
    restaurantId: 'rest-4',
    name: 'Country Sourdough Loaf (Fresh)',
    price: 180,
    description: 'Artisanal 36-hour slow fermented country sourdough bread, made with 100% organic locally milled wheat.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    carbonFootprint: 105,
    organic: true,
    vegan: true,
    localSourced: true,
    popular: true,
    ecoScore: 'A'
  },

  // The Conscious Carnivore (rest-5)
  {
    id: 'food-501',
    restaurantId: 'rest-5',
    name: 'Local Free-Range Grass-Fed Steak',
    price: 790,
    description: '250g sirloin steak sourced from grass-fed local pastured cattle, grilled with organic garlic butter and fresh rosemary.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    carbonFootprint: 890, // High, but we offset it!
    organic: true,
    vegan: false,
    localSourced: true,
    popular: true,
    ecoScore: 'B'
  },
  {
    id: 'food-502',
    restaurantId: 'rest-5',
    name: 'Organic Pastured Chicken Burger',
    price: 450,
    description: 'Juicy organic grilled chicken breast, wild organic arugula, local tomatoes, avocado spread, on a brioche bun.',
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    carbonFootprint: 380,
    organic: true,
    vegan: false,
    localSourced: true,
    popular: false,
    ecoScore: 'B'
  },

  // Nectar Juices & Bowls (rest-6)
  {
    id: 'food-601',
    restaurantId: 'rest-6',
    name: 'Imperfect Acai Energy Bowl',
    price: 340,
    description: 'Pure organic acai topped with sliced bananas and strawberries deemed "too imperfect" for supermarkets, plus organic house granola.',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    carbonFootprint: 70,
    organic: true,
    vegan: true,
    localSourced: false, // Acai is imported, but we use surplus fruits
    popular: true,
    ecoScore: 'A'
  }
];

// Surplus Food Rescue Section
export const SURPLUS_DEALS = [
  {
    id: 'deal-1',
    restaurantId: 'rest-4',
    restaurantName: 'Re-Bake Artisan Bakery',
    name: 'Artisan Pastry Box (Surplus)',
    originalPrice: 380,
    price: 150, // 60% off
    quantityLeft: 3,
    description: 'A surprise bundle of 3 delicious, fresh organic pastries baked this morning (croissants, pain au chocolat, or danishes). Helps combat bakery waste!',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    carbonFootprint: 120,
    ecoScore: 'A+',
    vegan: false
  },
  {
    id: 'deal-2',
    restaurantId: 'rest-6',
    restaurantName: 'Nectar Juices & Bowls',
    name: 'Surplus cold-pressed Juice Pack',
    originalPrice: 300,
    price: 120, // 60% off
    quantityLeft: 5,
    description: 'Pack of 2 juices squeezed today using imperfect local oranges and kale. Help us clear our inventory before close!',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    carbonFootprint: 45,
    ecoScore: 'A+',
    vegan: true
  },
  {
    id: 'deal-3',
    restaurantId: 'rest-1',
    restaurantName: 'The Green Beanery',
    name: 'Eco Bowl of the Day (Surplus)',
    originalPrice: 360,
    price: 160,
    quantityLeft: 2,
    description: 'Our signature quinoa buddha bowl prepared with wholesome ingredients at the end of lunch service.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    carbonFootprint: 100,
    ecoScore: 'A+',
    vegan: true
  }
];

export const MOCK_ORDERS = [
  {
    id: 'order-9001',
    date: '2026-06-25T13:45:00Z',
    restaurantName: 'The Green Beanery',
    restaurantId: 'rest-1',
    items: [
      { id: 'food-101', name: 'Organic Avocabo Green Salad', price: 320, quantity: 1 },
      { id: 'food-103', name: 'Detoxifying Green Smoothie', price: 190, quantity: 2 }
    ],
    subtotal: 700,
    packagingCharge: 38,
    deliveryCharge: 40,
    gst: 35,
    total: 813,
    carbonFootprint: 205, // grams
    carbonSaved: 180, // grams compared to standard delivery + meat meal
    packagingChoice: 'Compostable Paper',
    deliveryMethod: 'Bicycle',
    status: 'Delivered',
    treesPlanted: 1
  },
  {
    id: 'order-9002',
    date: '2026-06-28T20:10:00Z',
    restaurantName: 'Re-Bake Artisan Bakery',
    restaurantId: 'rest-4',
    items: [
      { id: 'deal-1', name: 'Artisan Pastry Box (Surplus)', price: 150, quantity: 2 }
    ],
    subtotal: 300,
    packagingCharge: 0,
    deliveryCharge: 30,
    gst: 15,
    total: 345,
    carbonFootprint: 240,
    carbonSaved: 520, // massive saving from surplus rescue
    packagingChoice: 'Compostable Paper',
    deliveryMethod: 'Electric Vehicle',
    status: 'Delivered',
    treesPlanted: 2
  }
];
