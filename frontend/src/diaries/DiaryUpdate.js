import {
  Alert,
  Button,
  FormLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostDetails, postUpdate } from "../api-helpers/helpers";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const FIELD_LIMITS = {
  title: 30,
  description: 120,
  location: 25,
};

const DiaryUpdate = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    imageUrl: "",
  });
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

        setInputs({
          title: data.post.title,
          description: data.post.description,
          imageUrl: data.post.image,
          location: data.post.location,
        });
      })
      .catch((err) => console.log(err));
  }, [id, navigate]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
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
            <FormLabel sx={{ fontFamily: "quicksand" }}>Image URL</FormLabel>
            <TextField
              onChange={handleChange}
              name="imageUrl"
              value={inputs.imageUrl}
              variant="standard"
              margin="normal"
            />

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
