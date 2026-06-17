import { Router } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/post-controller";
import { uploadPostImage } from "../lib/upload";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/", uploadPostImage, addPost);
postRouter.put("/:id", uploadPostImage, updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
