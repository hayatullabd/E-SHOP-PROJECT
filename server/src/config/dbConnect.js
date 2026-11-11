const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside Vercel or .env");
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cachedConnection.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null;
    console.error("Database connection failed:", e);
    throw e;
  }

  return cachedConnection.conn;
};

module.exports = dbConnect;
