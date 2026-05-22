import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "../api-helpers/helpers";
import DiaryItem from "./DiaryItem";
import { Link } from "react-router-dom";
import { demoDiaries } from "./demoDiaries";

const Diaries = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(data?.posts || []);
      })
      .catch((err) => {
        console.log(err);
        setPosts([]);
      });
  }, []);

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      padding={{ xs: 2, sm: 3 }}
      justifyContent="center"
      alignItems={"center"}
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8f9fb 0%, #f4ede1 24%, #ffffff 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mb: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#233142",
            fontFamily: "Quicksand, sans-serif",
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 700,
          }}
        >
          Travel Diaries
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 1, mb: 2 }}>
          Stories, snapshots, and little memories collected along the way.
        </Typography>
      </Box>
      <Box sx={{ width: "100%", maxWidth: "1200px", mb: 5 }}>
        <Typography
          sx={{
            color: "#233142",
            fontFamily: "Quicksand, sans-serif",
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 700,
            mb: 1,
          }}
        >
          Featured Demo Diaries
        </Typography>
        <Typography sx={{ color: "#6b7280", mb: 3 }}>
          These three sample stories will always stay visible here.
        </Typography>
        <Box sx={{ display: "grid", gap: 2 }}>
          {demoDiaries.map((item, index) => (
          <Box
            key={item._id || index}
            width="100%"
            display="flex"
            justifyContent="center"
          >
            <DiaryItem
              date={new Date(`${item.date}`).toLocaleDateString()}
              description={item.description}
              image={item.image}
              id={item._id || item.id}
              location={item.location}
              title={item.title}
              user={item.user?._id || item.user}
              name={item.user?.name || item.name || "Traveler"}
            />
          </Box>
          ))}
        </Box>
      </Box>
      {posts.length > 0 ? (
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          <Typography
            sx={{
              color: "#233142",
              fontFamily: "Quicksand, sans-serif",
              fontSize: { xs: "1.5rem", md: "2rem" },
              fontWeight: 700,
              mb: 1,
            }}
          >
            Community Diaries
          </Typography>
          <Typography sx={{ color: "#6b7280", mb: 3 }}>
            Real entries coming from your backend.
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            {posts.map((item, index) => (
              <Box
                key={item._id || item.id || index}
                width="100%"
                display="flex"
                justifyContent="center"
              >
                <DiaryItem
                  date={new Date(`${item.date}`).toLocaleDateString()}
                  description={item.description}
                  image={item.image}
                  id={item._id || item.id}
                  location={item.location}
                  title={item.title}
                  user={item.user?._id || item.user}
                  name={item.user?.name || item.name || "Traveler"}
                />
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "760px",
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            textAlign: "center",
            bgcolor: "#fffdf8",
            border: "1px dashed rgba(35, 49, 66, 0.18)",
          }}
        >
          <Typography
            sx={{ color: "#233142", fontSize: "1.7rem", fontWeight: 700, mb: 1 }}
          >
            No diaries yet
          </Typography>
          <Typography sx={{ color: "#6b7280", mb: 3 }}>
            Real posts from your backend will appear here once you add them.
          </Typography>
          <Button
            LinkComponent={Link}
            to="/add"
            variant="contained"
            sx={{
              bgcolor: "#d1512d",
              borderRadius: "999px",
              px: 3,
              "&:hover": {
                bgcolor: "#b24526",
              },
            }}
          >
            Add a Diary
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Diaries;
