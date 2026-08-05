import mongoose from "mongoose";

export const POST_FIELD_LIMITS = {
  title: 30,
  description: 120,
  location: 25,
};

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: POST_FIELD_LIMITS.title,
  },
  description: {
    type: String,
    required: true,
    maxlength: POST_FIELD_LIMITS.description,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: undefined,
    validate: {
      validator: (images) => !images || images.length <= 3,
      message: "A diary can have at most 3 images.",
    },
  },
  location: {
    type: String,
    required: true,
    maxlength: POST_FIELD_LIMITS.location,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Post", postSchema);
