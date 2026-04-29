import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();
connectDB();

const sampleCategories = [
  { name: 'Fruits & Veggies', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200' },
  { name: 'Dairy & Bread', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=200' },
  { name: 'Snacks', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=200' },
];

const sampleProducts = [
  {
    name: 'Fresh Apples (Shimla)',
    description: 'Crisp and sweet fresh apples from the orchards of Shimla.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=400',
    category: 'Fruits & Veggies',
    countInStock: 50,
    unit: '1 kg',
  },
  {
    name: 'Amul Taaza Toned Milk',
    description: 'Fresh and pure toned milk.',
    price: 54,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    category: 'Dairy & Bread',
    countInStock: 100,
    unit: '1 L',
  },
  {
    name: 'Lays India\'s Magic Masala',
    description: 'Crispy potato chips with a magic blend of Indian spices.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400',
    category: 'Snacks',
    countInStock: 200,
    unit: '50 g',
  },
  {
    name: 'Fresh Bananas',
    description: 'Sweet and healthy Robusta bananas.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400',
    category: 'Fruits & Veggies',
    countInStock: 80,
    unit: '1 Dozen',
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
