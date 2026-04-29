import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();
connectDB();

const sampleCategories = [
  { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=200' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1524592091214-8c6ca0ada62d?auto=format&fit=crop&q=80&w=200' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=200' },
  { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200' },
];

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'The ultimate iPhone with titanium design and A17 Pro chip.',
    price: 129900,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
    category: 'Mobiles',
    stock: 15,
    rating: 4.8,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'AI-powered smartphone with 200MP camera and S Pen.',
    price: 139900,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400',
    category: 'Mobiles',
    stock: 10,
    rating: 4.7,
  },
  {
    name: 'MacBook Air M3',
    description: 'Supercharged by M3 chip, thin and light laptop.',
    price: 114900,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    stock: 20,
    rating: 4.9,
  },
  {
    name: 'Dell XPS 13',
    description: 'Compact and powerful laptop with InfinityEdge display.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    stock: 12,
    rating: 4.6,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Iconic sneakers with superior cushioning and style.',
    price: 12995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    category: 'Shoes',
    stock: 25,
    rating: 4.5,
  },
  {
    name: 'Adidas Ultraboost',
    description: 'Performance running shoes with energy-returning Boost.',
    price: 17999,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=400',
    category: 'Shoes',
    stock: 18,
    rating: 4.7,
  },
  {
    name: 'Cotton Polo Shirt',
    description: 'Classic fit polo shirt made from 100% organic cotton.',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    stock: 50,
    rating: 4.3,
  },
  {
    name: 'Fossil Heritage Watch',
    description: 'Timeless analog watch with leather strap.',
    price: 14995,
    image: 'https://images.unsplash.com/photo-1524592091214-8c6ca0ada62d?auto=format&fit=crop&q=80&w=400',
    category: 'Watches',
    stock: 30,
    rating: 4.4,
  },
  {
    name: 'Seiko 5 Sports',
    description: 'Automatic watch with rugged design and reliability.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=400',
    category: 'Watches',
    stock: 15,
    rating: 4.8,
  },
  {
    name: 'Matte Lipstick',
    description: 'Long-lasting matte lipstick in various shades.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
    category: 'Beauty',
    stock: 100,
    rating: 4.2,
  },
  {
    name: 'Organic Honey',
    description: 'Pure and natural organic honey from wild forests.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
    category: 'Grocery',
    stock: 200,
    rating: 4.9,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 20 hours of playtime.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400',
    category: 'Accessories',
    stock: 40,
    rating: 4.5,
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless headphones with industry-leading noise cancellation.',
    price: 29900,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    category: 'Accessories',
    stock: 25,
    rating: 4.8,
  },
  {
    name: 'Leather Handbag',
    description: 'Elegant leather handbag for women, spacious and stylish.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    stock: 15,
    rating: 4.6,
  },
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    await Category.insertMany(sampleCategories);
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

