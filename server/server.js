require("dotenv").config();
// console.log(process.env.MONGODB_URI);
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require("mongoose");

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");

  await mongoose.connection.close();

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
