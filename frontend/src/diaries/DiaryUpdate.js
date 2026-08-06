import {
  Alert,
  Button,
  FormLabel,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostDetails, postUpdate } from "../api-helpers/helpers";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";

const FIELD_LIMITS = {
  title: 30,
  description: 120,
  location: 25,
};
const MAX_IMAGES = 3;

const isValidImageSource = (image) => {
  if (typeof image !== "string") {
    return false;
  }

  const trimmedImage = image.trim();

  return (
    Boolean(trimmedImage) &&
    trimmedImage.toLowerCase() !== "undefined" &&
    trimmedImage.toLowerCase() !== "null"
  );
};

const normalizeImageSources = (images) =>
  images
    .filter(isValidImageSource)
    .map((image) => image.trim());

const DiaryUpdate = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    imageUrl: "",
    imageUrls: [],
    imageFiles: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const selectedPreviewUrlsRef = useRef([]);
  const brokenImageWarningShownRef = useRef(false);
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const id = useParams().id;

  useEffect(() => {
    if (!id) {
      navigate("/profile");
      return;
    }

    getPostDetails(id)
      .then((data) => {
        setPost(data.post);
        const postImages = normalizeImageSources(
          data.post.images?.length ? data.post.images : [data.post.image]
        );

        setInputs({
          title: data.post.title,
          description: data.post.description,
          imageUrl: postImages[0] || "",
          imageUrls: postImages,
          imageFiles: [],
          location: data.post.location,
        });
        setImagePreviews(postImages);
      })
      .catch((err) => console.log(err));
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      selectedPreviewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = "";

    if (!selectedFiles.length) {
      return;
    }

    const availableSlots = MAX_IMAGES - imagePreviews.length;

    if (selectedFiles.length > availableSlots) {
      setToast({
        open: true,
        severity: "error",
        message:
          availableSlots > 0
            ? `You can add only ${availableSlots} more photo${
                availableSlots > 1 ? "s" : ""
              }.`
            : "You can upload up to 3 travel photos.",
      });
      return;
    }

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    selectedPreviewUrlsRef.current = [
      ...selectedPreviewUrlsRef.current,
      ...previewUrls,
    ];

    setInputs((prevState) => ({
      ...prevState,
      imageFiles: [...prevState.imageFiles, ...selectedFiles],
    }));
    setImagePreviews((prevState) => [...prevState, ...previewUrls]);
  };
  const removeImagePreview = (previewToRemove) => {
    if (!previewToRemove) {
      return;
    }

    const selectedFileIndex = selectedPreviewUrlsRef.current.indexOf(previewToRemove);

    if (selectedFileIndex !== -1) {
      URL.revokeObjectURL(previewToRemove);
      selectedPreviewUrlsRef.current = selectedPreviewUrlsRef.current.filter(
        (preview) => preview !== previewToRemove
      );
    }

    setInputs((prevState) => {
      const nextImageUrls = prevState.imageUrls.filter(
        (imageUrl) => imageUrl !== previewToRemove
      );

      if (nextImageUrls.length !== prevState.imageUrls.length) {
        return {
          ...prevState,
          imageUrl: nextImageUrls[0] || "",
          imageUrls: nextImageUrls,
        };
      }

      if (selectedFileIndex !== -1) {
        return {
          ...prevState,
          imageFiles: prevState.imageFiles.filter(
            (_, imageIndex) => imageIndex !== selectedFileIndex
          ),
        };
      }

      return prevState;
    });
    setImagePreviews((prevState) =>
      prevState.filter((preview) => preview !== previewToRemove)
    );
  };
  const handleRemoveImage = (index) => {
    removeImagePreview(imagePreviews[index]);
  };
  const handlePreviewImageError = (preview) => {
    if (!brokenImageWarningShownRef.current) {
      brokenImageWarningShownRef.current = true;
      setToast({
        open: true,
        severity: "warning",
        message: "Some saved photos could not load. Please upload them again.",
      });
    }

    removeImagePreview(preview);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imagePreviews.length) {
      setToast({
        open: true,
        severity: "error",
        message: "Please keep at least one travel photo.",
      });
      return;
    }

    postUpdate(inputs, id)
      .then(() => {
        setToast({
          open: true,
          severity: "success",
          message: "Diary updated successfully.",
        });
        setTimeout(() => navigate("/profile"), 900);
      })
      .catch((err) => {
        console.log(err);
        setToast({
          open: true,
          severity: "error",
          message: err?.message || "Unable to update diary.",
        });
      });
  };
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      width="100%"
      minHeight="100vh"
      px={{ xs: 2, sm: 3 }}
      py={{ xs: 3, md: 5 }}
    >
      <Box display="flex" margin="auto" padding={2} alignItems="center">
        <Typography
          fontWeight={"bold"}
          variant="h4"
          fontFamily={"dancing script"}
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, textAlign: "center" }}
        >
          Edit Your Travel Diary
        </Typography>
        <TravelExploreIcon
          sx={{
            fontSize: { xs: "32px", md: "40px" },
            paddingLeft: 1,
            color: "lightcoral  ",
          }}
        />
      </Box>
      {post && (
        <form onSubmit={handleSubmit}>
          <Box
            padding={{ xs: 3, sm: 4 }}
            display="flex"
            width="100%"
            maxWidth="760px"
            margin="auto"
            flexDirection={"column"}
            bgcolor="#fffdf8"
            borderRadius={5}
            boxShadow="0 18px 40px rgba(35, 49, 66, 0.08)"
          >
            <FormLabel sx={{ fontFamily: "quicksand" }}>Title</FormLabel>
            <TextField
              onChange={handleChange}
              name="title"
              value={inputs.title}
              variant="standard"
              margin="normal"
              inputProps={{ maxLength: FIELD_LIMITS.title }}
              helperText={`${inputs.title.length}/${FIELD_LIMITS.title}`}
            />
            <FormLabel sx={{ fontFamily: "quicksand" }}>Description</FormLabel>
            <TextField
              onChange={handleChange}
              name="description"
              value={inputs.description}
              variant="outlined"
              multiline
              rows={4}
              size="small"
              fullWidth
              inputProps={{ maxLength: FIELD_LIMITS.description }}
              helperText={`${inputs.description.length}/${FIELD_LIMITS.description}`}
              sx={{
                mt: 1,
                mb: 2,
                "& .MuiInputBase-inputMultiline": {
                  overflowY: "auto",
                  resize: "none",
                },
              }}
            />
            <FormLabel sx={{ fontFamily: "quicksand" }}>
              Travel Photos ({imagePreviews.length}/{MAX_IMAGES})
            </FormLabel>
            <Button
              component="label"
              variant="outlined"
              color="warning"
              startIcon={<PhotoCameraIcon />}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 2,
                textTransform: "none",
                py: 1,
                mt: 1,
                mb: 2,
              }}
            >
              {inputs.imageFiles.length
                ? `${inputs.imageFiles.length} new photo${
                    inputs.imageFiles.length > 1 ? "s" : ""
                  } selected`
                : "Choose up to 3 new photos"}
              <input
                hidden
                accept="image/*"
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </Button>
            {imagePreviews.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: `repeat(${imagePreviews.length}, minmax(0, 1fr))`,
                  },
                  gap: 1,
                  mb: 2,
                }}
              >
                {imagePreviews.map((preview, index) => (
                  <Box
                    key={`${preview}-${index}`}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={preview}
                      alt={`Travel diary ${index + 1}`}
                      onError={() => handlePreviewImageError(preview)}
                      sx={{
                        width: "100%",
                        height: { xs: 150, sm: 175 },
                        objectFit: "cover",
                        borderRadius: 2,
                        display: "block",
                      }}
                    />
                    <IconButton
                      type="button"
                      aria-label={`Remove travel photo ${index + 1}`}
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        color: "#233142",
                        "&:hover": {
                          bgcolor: "#ffffff",
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <FormLabel sx={{ fontFamily: "quicksand" }}>Location</FormLabel>
            <TextField
              onChange={handleChange}
              name="location"
              value={inputs.location}
              variant="standard"
              margin="normal"
              inputProps={{ maxLength: FIELD_LIMITS.location }}
              helperText={`${inputs.location.length}/${FIELD_LIMITS.location}`}
            />

            <Box
              sx={{
                width: { xs: "100%", sm: "70%", md: "50%" },
                margin: "auto",
                mt: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                type="button"
                onClick={() => navigate("/profile")}
                sx={{ flex: 1, borderRadius: 7, py: 1.2 }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="warning"
                sx={{ flex: 1, borderRadius: 7, py: 1.2 }}
                variant="contained"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </form>
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiaryUpdate;
