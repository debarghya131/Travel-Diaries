import arcjet, { fixedWindow, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
];

const envFile = envPaths.find((envPath) => fs.existsSync(envPath));
dotenv.config(envFile ? { path: envFile } : undefined);

if (!process.env.ARCJET_ENV && process.env.NODE_ENV !== "production") {
  process.env.ARCJET_ENV = "development";
}

const arcjetKey = process.env.ARCJET_KEY;

if (!arcjetKey) {
  throw new Error("ARCJET_KEY is not set. Check your backend .env file.");
}

const aj = arcjet({
  key: arcjetKey,
  rules: [],
});

const perUserAj = arcjet({
  key: arcjetKey,
  characteristics: ["userId"],
  rules: [],
});

export const readLimiter = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: 60,
    max: 120,
  })
);

export const writeLimiter = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: 60,
    max: 20,
  })
);

export const authLimiter = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: 60,
    max: 10,
  })
);

export const createPostLimiter = perUserAj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1d",
    max: 2,
  })
);

export const updatePostLimiter = perUserAj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1d",
    max: 2,
  })
);

export const applyRateLimit = async (
  limiter,
  req,
  res,
  message = "Too many requests. Please try again later.",
  props = {}
) => {
  const decision = await limiter.protect(req, props);

  if (decision.isErrored()) {
    console.error("Arcjet error:", decision.reason.message);
    return true;
  }

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      res.status(429).json({ message });
      return false;
    }

    res.status(403).json({ message: "Request blocked by Arcjet." });
    return false;
  }

  return true;
};
