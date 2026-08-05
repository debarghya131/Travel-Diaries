import { Router } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/post-controller";
import { uploadPostImages } from "../lib/upload";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/", uploadPostImages, addPost);
postRouter.put("/:id", uploadPostImages, updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
