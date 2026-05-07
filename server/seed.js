import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config();
connectDB();

const sampleCategories = [
  {
    name: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Watches",
    image:
      "https://images.unsplash.com/photo-1524592091214-8c6ca0ada62d?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200",
  },
];

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description:
      "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.",
    price: 129900,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
    category: "Mobiles",
    stock: 15,
    rating: 4.8,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "AI-powered smartphone with 200MP camera, S Pen, and titanium frame.",
    price: 139900,
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3f9b2b9b?auto=format&fit=crop&q=80&w=600",
    category: "Mobiles",
    stock: 10,
    rating: 4.7,
  },
  {
    name: "Google Pixel 8 Pro",
    description:
      "The most advanced Pixel yet, with a pro-level camera and Google AI.",
    price: 106999,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a3e6?auto=format&fit=crop&q=80&w=600",
    category: "Mobiles",
    stock: 12,
    rating: 4.6,
  },
  {
    name: "MacBook Air M3",
    description:
      "Supercharged by M3 chip, thin and light laptop with all-day battery life.",
    price: 114900,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
    category: "Laptops",
    stock: 20,
    rating: 4.9,
  },
  {
    name: "Dell XPS 13",
    description:
      "Compact and powerful laptop with InfinityEdge display and premium finish.",
    price: 125000,
    image:
      "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&q=80&w=600",
    category: "Laptops",
    stock: 12,
    rating: 4.6,
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description:
      "Powerful gaming laptop with AMD Ryzen 9 and RTX 40 series graphics.",
    price: 149990,
    image:
      "https://images.unsplash.com/photo-1624109381254-0f5b7b6d8b01?auto=format&fit=crop&q=80&w=600",
    category: "Laptops",
    stock: 8,
    rating: 4.8,
  },
  {
    name: "Nike Air Max 270",
    description:
      "Iconic sneakers with superior cushioning and modern lifestyle style.",
    price: 12995,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    category: "Shoes",
    stock: 25,
    rating: 4.5,
  },
  {
    name: "Adidas Ultraboost",
    description:
      "Performance running shoes with energy-returning Boost technology.",
    price: 17999,
    image:
      "https://images.unsplash.com/photo-1542293787938-c9e299b8803b?auto=format&fit=crop&q=80&w=600",
    category: "Shoes",
    stock: 18,
    rating: 4.7,
  },
  {
    name: "Puma RS-X Bold",
    description:
      "Futuristic chunky sneakers with bold colors and comfortable cushioning.",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1600180758890-7b0b6f0b6f8f?auto=format&fit=crop&q=80&w=600",
    category: "Shoes",
    stock: 12,
    rating: 4.3,
  },
  {
    name: "Cotton Polo Shirt",
    description:
      "Classic fit polo shirt made from 100% premium organic cotton.",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1520975910595-96cf3a1e5d0d?auto=format&fit=crop&q=80&w=600",
    category: "Fashion",
    stock: 50,
    rating: 4.3,
  },
  {
    name: "Slim Fit Denim Jacket",
    description:
      "Versatile denim jacket with a modern slim fit and premium wash.",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600",
    category: "Fashion",
    stock: 30,
    rating: 4.4,
  },
  {
    name: "Leather Handbag",
    description: "Elegant leather handbag for women, spacious and stylish.",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1520975910595-96cf3a1e5d0d?auto=format&fit=crop&q=80&w=600",
    category: "Fashion",
    stock: 15,
    rating: 4.6,
  },
  {
    name: "Apple Watch Series 9",
    description:
      "Smartwatch with powerful health features and advanced activity tracking.",
    price: 41900,
    image:
      "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&q=80&w=600",
    category: "Watches",
    stock: 20,
    rating: 4.9,
  },
  {
    name: "Fossil Heritage Watch",
    description:
      "Timeless analog watch with premium leather strap and clean dial.",
    price: 14995,
    image:
      "https://images.unsplash.com/photo-1524592091214-8c6ca0ada62d?auto=format&fit=crop&q=80&w=600",
    category: "Watches",
    stock: 30,
    rating: 4.4,
  },
  {
    name: "Seiko 5 Sports",
    description:
      "Automatic watch with rugged design and mechanical reliability.",
    price: 24000,
    image:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=600",
    category: "Watches",
    stock: 15,
    rating: 4.8,
  },
  {
    name: "Matte Lipstick",
    description: "Long-lasting matte lipstick in various high-pigment shades.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    category: "Beauty",
    stock: 100,
    rating: 4.2,
  },
  {
    name: "Vitamin C Serum",
    description:
      "Brightening skin serum with pure Vitamin C and Hyaluronic acid.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1586306873862-8a7984d59f2d?auto=format&fit=crop&q=80&w=600",
    category: "Beauty",
    stock: 60,
    rating: 4.7,
  },
  {
    name: "Organic Honey",
    description: "Pure and natural organic honey sourced from wild forests.",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1508747703725-7192b6f7a1d6?auto=format&fit=crop&q=80&w=600",
    category: "Grocery",
    stock: 200,
    rating: 4.9,
  },
  {
    name: "Premium Basmati Rice",
    description: "Extra long grain aged basmati rice with exquisite aroma.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    category: "Grocery",
    stock: 150,
    rating: 4.8,
  },
  {
    name: "Noise Cancelling Headphones",
    description:
      "Wireless headphones with industry-leading active noise cancellation.",
    price: 29900,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "MagSafe Wireless Charger",
    description:
      "Fast wireless charging with perfectly aligned magnets for iPhone.",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    stock: 45,
    rating: 4.6,
  },
  {
    name: "Bluetooth Speaker",
    description:
      "Portable waterproof speaker with 20 hours of immersive playtime.",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    stock: 40,
    rating: 4.5,
  },
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    await Category.insertMany(sampleCategories);
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
