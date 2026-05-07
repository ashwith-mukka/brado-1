import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const fetchApi =
  global.fetch || (await import("node-fetch")).then((m) => m.default);

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
const tokensFrom = (name) =>
  normalize(name)
    .split(/\s+/)
    .filter((t) => t && t.length >= 3)
    .slice(0, 4);

const run = async () => {
  await connectDB();
  const products = await Product.find();
  const report = [];

  for (const p of products) {
    const img = p.image;
    let accessible = false;
    let status = null;
    try {
      const head = await fetchApi(img, { method: "HEAD" });
      status = head.status;
      accessible =
        status >= 200 &&
        status < 300 &&
        (head.headers.get("content-type") || "").startsWith("image");
    } catch (e) {
      accessible = false;
    }

    if (!accessible) {
      const tokens = tokensFrom(p.name);
      const query = tokens.length ? tokens.join(",") : "product";
      const newImage = `https://source.unsplash.com/600x600/?${encodeURIComponent(query)}`;
      await Product.findByIdAndUpdate(p._id, { image: newImage });
      report.push({ name: p.name, oldImage: img, oldStatus: status, newImage });
      console.log("Updated", p.name, "->", newImage);
    } else {
      report.push({
        name: p.name,
        oldImage: img,
        oldStatus: status,
        newImage: null,
      });
    }
  }

  console.log("\nSummary:");
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
