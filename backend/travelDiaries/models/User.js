import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required() {
      return !this.clerkId;
    },
    minLength: 6,
  },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

export default model("User", userSchema);
// users
