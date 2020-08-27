const { Recipe } = require("./models/recipe");
const mongoose = require("mongoose");
const config = require("config");
const data = require("./seedRecipesTags.json");
const tags = require("./seedTagsDef.json");

async function seed() {
  await mongoose.connect(config.get("db"));

  await Recipe.deleteMany({});

  const thedata = data.map((recipe) => {
    let thetag = tags.find((t) => t.name === recipe.tags);
    console.log(recipe.title);
    return {
      ...recipe,
      tags: [thetag._id],
    };
  });

  await Recipe.insertMany(thedata);

  mongoose.disconnect();

  console.info("Done!");
}

seed();
