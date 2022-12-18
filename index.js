const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRouter = require("./routers/users");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/posts");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Could not connect to MongoDB"));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(8800, () => {
  console.log("app is running");
});
