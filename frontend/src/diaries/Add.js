import {
  Alert,
  Box,
  Button,
  FormLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { addPost } from "../api-helpers/helpers";
import { useNavigate } from "react-router-dom";

const FIELD_LIMITS = {
  title: 30,
  description: 120,
  location: 25,
};

const Add = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    imageUrl: "",
    date: "",
  });
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onResReceived = () => {
    setToast({
      open: true,
      severity: "success",
      message: "Diary added successfully.",
    });
    setTimeout(() => navigate("/diaries"), 900);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(inputs)
      .then(onResReceived)
      .catch((err) => {
        console.log(err);
        setToast({
          open: true,
          severity: "error",
          message: err?.message || "Unable to add diary.",
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
      py={{ xs: 3, md: 4 }}
    >
      <Box
        display="flex"
        justifyContent="center"
        padding={{ xs: 1.5, md: 1 }}
        alignItems="center"
        mb={{ xs: 1.5, md: 3 }}
        gap={0.75}
      >
        <Typography
          fontWeight={"bold"}
          variant="h4"
          fontFamily={"dancing script"}
          sx={{
            fontSize: { xs: "1.65rem", sm: "2.2rem", md: "3rem" },
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          Add Your Travel Diary
        </Typography>
        <TravelExploreIcon
          sx={{
            fontSize: { xs: "26px", md: "40px" },
            color: "lightcoral  ",
          }}
        />
      </Box>
      <form onSubmit={handleSubmit}>
        <Box
          padding={{ xs: 2.5, sm: 4 }}
          display="flex"
          width={{ xs: "84%", sm: "100%" }}
          maxWidth={{ xs: "340px", sm: "540px", md: "860px", lg: "920px" }}
          margin="auto"
          flexDirection={"column"}
          bgcolor="#fffdf8"
          borderRadius={5}
          boxShadow="0 18px 40px rgba(35, 49, 66, 0.08)"
          gap={1}
        >
          <FormLabel sx={{ fontFamily: "quicksand" }}>Title</FormLabel>
          <TextField
            onChange={handleChange}
            name="title"
            value={inputs.title}
            variant="outlined"
            size="small"
            fullWidth
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
            variant="outlined"
            size="small"
            fullWidth
          />

          <FormLabel sx={{ fontFamily: "quicksand" }}>Location</FormLabel>
          <TextField
            onChange={handleChange}
            name="location"
            value={inputs.location}
            variant="outlined"
            size="small"
            fullWidth
            inputProps={{ maxLength: FIELD_LIMITS.location }}
            helperText={`${inputs.location.length}/${FIELD_LIMITS.location}`}
          />
          <FormLabel sx={{ fontFamily: "quicksand" }}>Date</FormLabel>
          <TextField
            type="date"
            onChange={handleChange}
            name="date"
            value={inputs.date}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            color="warning"
            sx={{
              width: { xs: "100%", sm: "60%", md: "50%" },
              margin: "auto",
              mt: 1.5,
              borderRadius: 7,
              py: 0.95,
            }}
            variant="contained"
          >
            Post
          </Button>
        </Box>
      </form>
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

export default Add;
