const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cd(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "images/png" ||
    file.mimetype === "images/jpg" ||
    file.mimetype === "images/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));

const URI = process.env.MongodbUri;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  statusCode = error.statusCode;
  message = error.message;
  data = error.data;
  res.status(statusCode).json({ message: message, data: data });
});
mongoose
  .connect(URI)
  .then((result) => {
    app.listen(3002, (req, res) => {
      console.log("server started on port 3002");
    });
  })
  .catch((err) => {
    console.log(err);
  });
