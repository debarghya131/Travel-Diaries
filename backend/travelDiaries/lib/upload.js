import multer from "multer";

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."));
  }

  return cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
    fieldSize: 15 * 1024 * 1024,
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
            ? "Each image must be 3MB or smaller."
            : err.code === "LIMIT_FIELD_VALUE"
            ? "Saved images are too large. Please reduce photo sizes."
            : err.code === "LIMIT_UNEXPECTED_FILE"
            ? "You can upload up to 3 travel photos."
            : err.message,
      });
    }

    return next();
  });
};
