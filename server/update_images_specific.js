import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const mapping = {
  "Samsung Galaxy S24 Ultra":
    "https://source.unsplash.com/600x600/?samsung,galaxy,s24,phone",
  "Google Pixel 8 Pro":
    "https://source.unsplash.com/600x600/?google,pixel,phone",
  "ASUS ROG Zephyrus G14":
    "https://source.unsplash.com/600x600/?asus,rog,zephyrus,laptop",
  "Adidas Ultraboost":
    "https://source.unsplash.com/600x600/?adidas,ultraboost,shoes",
  "Puma RS-X Bold": "https://source.unsplash.com/600x600/?puma,rsx,shoes",
  "Cotton Polo Shirt": "https://source.unsplash.com/600x600/?polo,shirt,cotton",
  "Leather Handbag": "https://source.unsplash.com/600x600/?leather,handbag",
  "Fossil Heritage Watch": "https://source.unsplash.com/600x600/?fossil,watch",
  "Vitamin C Serum":
    "https://source.unsplash.com/600x600/?vitamin,c,serum,skincare",
  "Organic Honey": "https://source.unsplash.com/600x600/?organic,honey,jar",
};

const run = async () => {
  await connectDB();
  for (const [name, url] of Object.entries(mapping)) {
    const prod = await Product.findOneAndUpdate(
      { name },
      { image: url },
      { new: true },
    );
    if (prod) {
      console.log("Updated:", name, "->", url);
    } else {
      console.log("Not found in DB:", name);
    }
  }
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
