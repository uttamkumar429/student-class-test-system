const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

const disconnectTestDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error("Test DB disconnect error:", error);
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
};