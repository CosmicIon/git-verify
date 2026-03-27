const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gitverify";
const MONGODB_AUTO_INDEX =
  String(process.env.MONGODB_AUTO_INDEX || "true").toLowerCase() !== "false";

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: MONGODB_AUTO_INDEX,
      serverSelectionTimeoutMS: 4000,
    });

    console.log(
      JSON.stringify({
        component: "database",
        event: "connected",
        uri: MONGODB_URI,
      })
    );
  } catch (error) {
    console.warn(
      JSON.stringify({
        component: "database",
        event: "connection_failed",
        message: error.message,
      })
    );
  }
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDatabase,
  isDatabaseReady,
};
