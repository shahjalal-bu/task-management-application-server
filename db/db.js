const mongoose = require("mongoose");

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error("Mongo url not set in env file");
  return new Error("Mongo url not set in env file");
}

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(dbUri);
    console.log("Mongo connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectToMongo;
