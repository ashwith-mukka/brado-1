import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const fetchApi =
  global.fetch || (await import("node-fetch")).then((m) => m.default);

const targets = [
  "Samsung Galaxy S24 Ultra",
  "Google Pixel 8 Pro",
  "ASUS ROG Zephyrus G14",
  "Adidas Ultraboost",
  "Puma RS-X Bold",
  "Cotton Polo Shirt",
  "Leather Handbag",
  "Fossil Heritage Watch",
  "Vitamin C Serum",
  "Organic Honey",
];

const run = async () => {
  await connectDB();
  for (const name of targets) {
    const p = await Product.findOne({ name });
    if (!p) {
      console.log("Not found:", name);
      continue;
    }
    const url = p.image;
    try {
      const res = await fetchApi(url, { method: "GET", redirect: "follow" });
      if (res.ok) {
        const final = res.url || url;
        if (final !== url) {
          await Product.findByIdAndUpdate(p._id, { image: final });
          console.log("Updated", name, "->", final);
        } else {
          console.log("No redirect for", name, "-", url);
        }
      } else {
        console.log("GET failed for", name, url, "status", res.status);
      }
    } catch (e) {
      console.log("Error fetching", name, url, e.message);
    }
  }
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
