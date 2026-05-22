import { clerkMiddleware } from "@clerk/express";
import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import userRouter from "./routing/user-routes";
import postRouter from "./routing/post-routes";
import cors from "cors";

const app = express();
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
];

const envFile = envPaths.find((envPath) => fs.existsSync(envPath));
dotenv.config(envFile ? { path: envFile } : undefined);
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGODB_URL;

// middlewares
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/user", userRouter);
app.use("/posts", postRouter);

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not set. Check your backend .env file.");
}

// connections
mongoose
  .connect(mongoUrl)
  .then(() =>
    app.listen(port, () =>
      console.log(`Connection successful and listening on port ${port}`)
    )
  )
  .catch((err) => console.log(err));
