import { getAuth } from "@clerk/express";
import { compareSync, hashSync } from "bcryptjs";
import { applyRateLimit, authLimiter, readLimiter } from "../lib/arcjet";
import User from "../models/User";

export const getAllUsers = async (req, res) => {
  const allowed = await applyRateLimit(
    readLimiter,
    req,
    res,
    "Too many user requests. Please slow down."
  );

  if (!allowed) {
    return;
  }

  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }

  return res.status(200).json({ users });
};

export const getUserById = async (req, res) => {
  const allowed = await applyRateLimit(
    readLimiter,
    req,
    res,
    "Too many profile requests. Please slow down."
  );

  if (!allowed) {
    return;
  }

  const id = req.params.id;

  let user;
  try {
    user = await User.findById(id).populate("posts");
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  return res.status(200).json({ user });
};

export const syncClerkUser = async (req, res) => {
  const allowed = await applyRateLimit(
    authLimiter,
    req,
    res,
    "Too many sign-in sync requests. Please try again shortly."
  );

  if (!allowed) {
    return;
  }

  const { userId } = getAuth(req);
  const { name, email, username, profileImage } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!email) {
    return res.status(422).json({ message: "Email is required" });
  }

  let user;

  try {
    user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      user.clerkId = userId;
      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.profileImage = profileImage || user.profileImage;
      await user.save();
    } else {
      user = new User({
        clerkId: userId,
        name: name || "Traveler",
        email,
        username: username || undefined,
        profileImage: profileImage || undefined,
      });
      await user.save();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to sync Clerk user" });
  }

  return res.status(200).json({ user });
};

export const signup = async (req, res, next) => {
  const allowed = await applyRateLimit(
    authLimiter,
    req,
    res,
    "Too many signup attempts. Please try again later."
  );

  if (!allowed) {
    return;
  }

  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.length < 6
  ) {
    return res.status(422).json({ message: "Inavalid Data" });
  }

  const hashedPassword = hashSync(password);

  let user;
  try {
    user = new User({ email, name, password: hashedPassword });
    await user.save();
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }

  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const allowed = await applyRateLimit(
    authLimiter,
    req,
    res,
    "Too many login attempts. Please try again later."
  );

  if (!allowed) {
    return;
  }

  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.length < 6) {
    return res.status(422).json({ message: "Inavalid Data" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "No user found" });
  }
  const isPasswordCorrect = compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ id: existingUser._id, message: "Login Successfull" });
};
