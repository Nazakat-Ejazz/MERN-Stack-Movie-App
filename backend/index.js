import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

import routes from "./routes/index.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/api/v1", routes);

app.use(cookieParser());

const port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected!");
    server.listen(port, () => {
      console.log(`Server is listening at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
