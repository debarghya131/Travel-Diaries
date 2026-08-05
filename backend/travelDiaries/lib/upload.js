import fs from "fs";
import multer from "multer";
import path from "path";

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const basename = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${basename || "travel-photo"}${extension}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadPostImages = (req, res, next) => {
  upload.fields([
    { name: "photos", maxCount: 3 },
    { name: "photo", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5MB or smaller."
            : err.code === "LIMIT_UNEXPECTED_FILE"
            ? "You can upload up to 3 travel photos."
            : err.message,
      });
    }

    return next();
  });
};
