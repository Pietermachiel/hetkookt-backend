const { Category } = require("./models/category");
const { Tag } = require("./models/tag");
const mongoose = require("mongoose");
const config = require("config");
const data = require("./seed.json");

async function seed() {
  await mongoose.connect(config.get("db"));

  await Tag.deleteMany({});
  await Category.deleteMany({});

  for (let category of data) {
    const { _id: categoryId } = await new Category({
      name: category.name,
    }).save();
    const tags = category.tags.map((tag) => ({
      ...tag,
      category: { _id: categoryId, name: category.name },
    }));
    await Tag.insertMany(tags);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
