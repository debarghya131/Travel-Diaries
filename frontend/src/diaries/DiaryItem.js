import {
  Alert,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { postDelete } from "../api-helpers/helpers";
const DiaryItem = ({
  title,
  description,
  image,
  images,
  location,
  date,
  id,
  user,
  name,
}) => {
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const hasValidId = Boolean(id);
  const [failedImageSources, setFailedImageSources] = useState([]);
  const validImageSources = (images?.length > 0 ? images : image ? [image] : [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(
      (item) =>
        item &&
        item.toLowerCase() !== "undefined" &&
        item.toLowerCase() !== "null"
    );
  const galleryImages = validImageSources.filter(
    (item) => !failedImageSources.includes(item)
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasMultipleImages = galleryImages.length > 1;
  const activeImageSrc = galleryImages[activeImageIndex] || galleryImages[0];

  useEffect(() => {
    setActiveImageIndex(0);
    setFailedImageSources([]);
  }, [image, images]);

  useEffect(() => {
    if (activeImageIndex >= galleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, galleryImages.length]);

  const handleImageError = (src) => {
    setFailedImageSources((prevState) =>
      prevState.includes(src) ? prevState : [...prevState, src]
    );
  };

  const showPreviousImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const isLoogedInUser = () => {
    if (localStorage.getItem("userId") === user) {
      return true;
    }
    return false;
  };

  const handleDelete = () => {
    if (!hasValidId) {
      return;
    }

    postDelete(id)
      .then(() =>
        setToast({
          open: true,
          severity: "success",
          message: "Diary deleted successfully.",
        })
      )
      .catch((err) => {
        console.log(err);
        setToast({
          open: true,
          severity: "error",
          message: err?.message || "Unable to delete diary.",
        });
      });
  };
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "720px", md: "860px" },
        height: "auto",
        margin: { xs: 0.5, sm: 1 },
        padding: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(35, 49, 66, 0.12)",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: "#ff3b30", width: { xs: 42, sm: 48 }, height: { xs: 42, sm: 48 } }}
            aria-label="recipe"
          >
            {name.charAt(0)}
          </Avatar>
        }
        title={location}
        subheader={date}
        sx={{
          pb: 1,
          "& .MuiCardHeader-title": {
            color: "#233142",
            fontWeight: 600,
          },
          "& .MuiCardHeader-subheader": {
            color: "#6b7280",
          },
        }}
      />

      {galleryImages.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: hasMultipleImages ? "1fr 84px" : "1fr",
            },
            gap: hasMultipleImages ? 1 : 0,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              position: "relative",
              minWidth: 0,
            }}
          >
            <Box
              component="img"
              src={activeImageSrc}
              alt={title}
              onError={() => handleImageError(activeImageSrc)}
              sx={{
                width: "100%",
                height: { xs: 190, sm: 220, md: 260 },
                objectFit: "cover",
                display: "block",
              }}
            />
            {hasMultipleImages && (
              <>
                <IconButton
                  type="button"
                  aria-label="Previous photo"
                  onClick={showPreviousImage}
                  sx={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255, 255, 255, 0.88)",
                    color: "#233142",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      bgcolor: "#ffffff",
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  type="button"
                  aria-label="Next photo"
                  onClick={showNextImage}
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255, 255, 255, 0.88)",
                    color: "#233142",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      bgcolor: "#ffffff",
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
          {hasMultipleImages && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: `repeat(${galleryImages.length}, minmax(0, 1fr))`,
                  sm: "1fr",
                },
                gap: 1,
                p: { xs: 1, sm: 0 },
                pr: { sm: 1 },
                pb: { sm: 0 },
              }}
            >
              {galleryImages.map((item, index) => (
                <Box
                  key={`${item}-${index}`}
                  component="button"
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View photo ${index + 1}`}
                  sx={{
                    border: index === activeImageIndex ? "2px solid #d1512d" : 0,
                    borderRadius: 1,
                    p: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: { xs: 54, sm: "100%" },
                    minHeight: { sm: 0 },
                    bgcolor: "transparent",
                    opacity: index === activeImageIndex ? 1 : 0.68,
                    transition: "opacity 160ms ease, border-color 160ms ease",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={item}
                    alt=""
                    onError={() => handleImageError(item)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
      <CardContent sx={{ pb: 1 }}>
        <Typography
          paddingBottom={1}
          variant="h6"
          sx={{ color: "#233142", fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "rgba(35, 49, 66, 0.2)",
            mb: 1.5,
          }}
        />
        <Box paddingTop={1} display="flex" flexDirection={{ xs: "column", sm: "row" }}>
          <Typography
            width="auto"
            sx={{ mr: 1, mb: { xs: 0.6, sm: 0 } }}
            fontWeight={"bold"}
            variant="caption"
          >
            {name}:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </CardContent>

      {isLoogedInUser() && (
        <CardActions
          sx={{
            justifyContent: "flex-end",
            gap: 1.25,
            px: 2,
            pb: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
          }}
        >
          <Button
            LinkComponent={Link}
            to={`/post/${id}`}
            variant="outlined"
            startIcon={<ModeEditOutlineIcon />}
            disabled={!hasValidId}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              borderColor: "#f59e0b",
              color: "#c77000",
              px: 2,
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                borderColor: "#d97706",
                bgcolor: "rgba(245, 158, 11, 0.08)",
              },
            }}
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            disabled={!hasValidId}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              bgcolor: "#d1512d",
              px: 2,
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                bgcolor: "#b24526",
              },
            }}
          >
            Delete
          </Button>
        </CardActions>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
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
    </Card>
  );
};

export default DiaryItem;
