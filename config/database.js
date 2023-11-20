const mongoose = require("mongoose");
require("dotenv").config;

const databaseToServerConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database to server connection success");
    })
    .catch((err) => {
      {
        console.log("DB Connection Fail");
        console.error(err);
        process.exit(1);
      }
    });
};

module.exports = databaseToServerConnection;
