require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Pricing = require('../models/Pricing');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@bottleroute.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

const PRODUCTS = [
  {
    name: 'Grey Goose',
    category: 'vodka',
    description: 'Premium French vodka, smooth and crisp.',
    price: 64.99,
    volume: '750ml',
    image: 'https://images.unsplash.com/photo-1613063877102-2b30af133963?w=600&q=80',
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'Johnnie Walker Black Label',
    category: 'whisky',
    description: 'Blended Scotch whisky aged 12 years.',
    price: 54.99,
    volume: '750ml',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80',
    featured: true,
    sortOrder: 2,
  },
  {
    name: 'Macallan 12 Double Cask',
    category: 'whisky',
    description: 'Highland single malt Scotch whisky.',
    price: 89.99,
    volume: '750ml',
    image: 'https://images.unsplash.com/photo-1582819509237-d052ba2e0f79?w=600&q=80',
    featured: true,
    sortOrder: 3,
  },
  {
    name: 'Patron Silver',
    category: 'tequila',
    description: '100% agave tequila, smooth finish.',
    price: 79.99,
    volume: '750ml',
    image: 'https://images.unsplash.com/photo-1594412300751-08e9c0e94f2d?w=600&q=80',
    featured: true,
    sortOrder: 4,
  },
  {
    name: 'Hennessy VS',
    category: 'other',
    description: 'Classic VS cognac blend.',
    price: 74.99,
    volume: '750ml',
    image: 'https://images.unsplash.com/photo-1569870499705-504209102861?w=600&q=80',
    featured: true,
    sortOrder: 5,
  },
  {
    name: 'Red Bull Energy Drink',
    category: 'convenience',
    description: 'Energy drink, perfect mixer.',
    price: 3.99,
    volume: '250ml',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&q=80',
    featured: true,
    sortOrder: 6,
  },
];

const PRICING = {
  plans: [
    {
      name: 'Standard',
      price: 'Free',
      period: '',
      desc: 'Perfect for casual orders.',
      features: [
        'Delivery fee: $5.99 per order',
        'Standard 30-min delivery',
        'All product categories',
        'Order tracking',
        'Age verification on delivery',
      ],
      cta: 'Order Now',
      href: '/shop',
      highlight: false,
    },
    {
      name: 'Member',
      price: '$9.99',
      period: '/month',
      desc: 'Best value for regular customers.',
      features: [
        'Free delivery on all orders',
        'Priority queue — faster delivery',
        'Exclusive member deals',
        'Early access to new products',
        'Order tracking',
        'Dedicated support',
      ],
      cta: 'Get Started',
      href: '/contact',
      highlight: true,
    },
    {
      name: 'Corporate',
      price: 'Custom',
      period: '',
      desc: 'For events and bulk orders.',
      features: [
        'Bulk order discounts',
        'Scheduled delivery slots',
        'Dedicated account manager',
        'Custom gift set packaging',
        'Invoice billing available',
        'Event planning support',
      ],
      cta: 'Contact Us',
      href: '/contact',
      highlight: false,
    },
  ],
  deliveryFees: [
    { zone: 'Within 5 km', fee: '$3.99', time: '20-30 min' },
    { zone: '5–10 km', fee: '$5.99', time: '30-45 min' },
    { zone: '10–20 km', fee: '$7.99', time: '45-60 min' },
    { zone: 'Member (any zone)', fee: 'FREE', time: 'Priority' },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding.');

  // Admin
  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
  } else {
    await Admin.create({
      name: 'Site Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'superadmin',
    });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // Products
  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products.`);

  // Pricing
  await Pricing.deleteMany({});
  await Pricing.create(PRICING);
  console.log('Seeded pricing plans & delivery fees.');

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
