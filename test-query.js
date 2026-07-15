const mongoose = require("mongoose");
require('dotenv').config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Need to define a simple schema just for testing, or require the typescript one via ts-node,
  // but it's simpler to just define it here to avoid ts-node issues.
  const courseSchema = new mongoose.Schema({}, { strict: false });
  const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

  const minPrice = 0;
  const maxPrice = 99999;
  const filter = { price: { $gte: minPrice, $lte: maxPrice } };
  
  try {
    const courses = await Course.find(filter)
      .sort({ totalStudents: -1 })
      .limit(8)
      .populate("instructor", "name avatar");
      
    console.log("Found:", courses.length);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
run();
