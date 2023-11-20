const express = require("express");
const app = express();
require("dotenv").config();
const databaseToServerConnection = require("./config/database");
const cloudinaryConnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const router = require("./routes/route");

databaseToServerConnection();
cloudinaryConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/upload", router);

app.get("/", (req, res) => {
  res.send("hello file Upload");
});

app.listen(process.env.PORT, () => {
  console.log("server is running at port: ", process.env.PORT);
});
