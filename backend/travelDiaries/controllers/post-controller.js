import mongoose from "mongoose";
import {
  applyRateLimit,
  createPostLimiter,
  readLimiter,
  updatePostLimiter,
  writeLimiter,
} from "../lib/arcjet";
import Post, { POST_FIELD_LIMITS } from "../models/Post";
import User from "../models/User";

const isInvalidObjectId = (id) => !id || !mongoose.Types.ObjectId.isValid(id);
const getUploadedImageUrl = (req) => {
  if (!req.file) {
    return "";
  }

  return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
};

const isInvalidPostPayload = ({ title, description, location, image, date, user }) =>
  !title ||
  title.trim() === "" ||
  title.length > POST_FIELD_LIMITS.title ||
  !description ||
  description.trim() === "" ||
  description.length > POST_FIELD_LIMITS.description ||
  !location ||
  location.trim() === "" ||
  location.length > POST_FIELD_LIMITS.location ||
  !image ||
  image.trim() === "" ||
  !date ||
  !user;

const isInvalidPostUpdatePayload = ({ title, description, location, image }) =>
  !title ||
  title.trim() === "" ||
  title.length > POST_FIELD_LIMITS.title ||
  !description ||
  description.trim() === "" ||
  description.length > POST_FIELD_LIMITS.description ||
  !location ||
  location.trim() === "" ||
  location.length > POST_FIELD_LIMITS.location ||
  !image ||
  image.trim() === "";

export const getAllPosts = async (req, res) => {
  const allowed = await applyRateLimit(
    readLimiter,
    req,
    res,
    "Too many diary requests. Please slow down."
  );

  if (!allowed) {
    return;
  }

  let posts;
  try {
    posts = await Post.find().populate("user");
  } catch (err) {
    return console.log(err);
  }

  if (!posts) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }

  return res.status(200).json({ posts });
};
export const addPost = async (req, res) => {
  const { title, description, location, date, image, user } = req.body;
  const postImage = getUploadedImageUrl(req) || image;

  if (
    isInvalidPostPayload({
      title,
      description,
      location,
      date,
      image: postImage,
      user,
    })
  ) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  const allowed = await applyRateLimit(
    createPostLimiter,
    req,
    res,
    "You can create only 2 posts per day.",
    { userId: String(user) }
  );

  if (!allowed) {
    return;
  }

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  let post;

  try {
    post = new Post({
      title,
      description,
      image: postImage,
      location,
      date: new Date(`${date}`),
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.posts.push(post);
    await existingUser.save({ session });
    post = await post.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
  return res.status(201).json({ post });
};

export const getPostById = async (req, res) => {
  const allowed = await applyRateLimit(
    readLimiter,
    req,
    res,
    "Too many diary requests. Please slow down."
  );

  if (!allowed) {
    return;
  }

  const id = req.params.id;

  if (isInvalidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  let post;

  try {
    post = await Post.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch post" });
  }
  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  return res.status(200).json({ post });
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, description, location, image } = req.body;
  const postImage = getUploadedImageUrl(req) || image;

  if (isInvalidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  if (isInvalidPostUpdatePayload({ title, description, location, image: postImage })) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  let post;
  try {
    post = await Post.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch post" });
  }

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const allowed = await applyRateLimit(
    updatePostLimiter,
    req,
    res,
    "You can update posts only 2 times per day.",
    { userId: String(post.user) }
  );

  if (!allowed) {
    return;
  }

  try {
    post = await Post.findByIdAndUpdate(id, {
      title,
      description,
      image: postImage,
      location,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to update post" });
  }

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  return res.status(200).json({ message: "Updated Successfully" });
};

export const deletePost = async (req, res) => {
  const allowed = await applyRateLimit(
    writeLimiter,
    req,
    res,
    "Too many delete requests. Please wait a moment."
  );

  if (!allowed) {
    return;
  }

  const id = req.params.id;

  if (isInvalidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  let post;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    post = await Post.findById(id).populate("user");
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }
    post.user.posts.pull(post);
    await post.user.save({ session });
    post = await Post.findByIdAndRemove(id);
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to delete post" });
  }
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(200).json({ message: "Deleted Successfully" });
};
