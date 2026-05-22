import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useClerk } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { getUserDetails } from "../api-helpers/helpers";
import DiaryItem from "../diaries/DiaryItem";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    getUserDetails()
      .then((data) => setUser(data.user))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = async () => {
    localStorage.removeItem("userId");
    await signOut();
    navigate("/");
  };

  const postsCount = user?.posts?.length || 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, sm: 2.5, md: 5 },
        py: { xs: 3, md: 5 },
        background:
          "linear-gradient(180deg, #f4ede1 0%, #f8f9fb 28%, #ffffff 100%)",
      }}
    >
      {user && (
        <>
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              display: "grid",
              gap: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 6,
                border: "1px solid rgba(35, 49, 66, 0.08)",
                boxShadow: "0 24px 60px rgba(35, 49, 66, 0.08)",
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  background:
                    "linear-gradient(135deg, #233142 0%, #394867 60%, #d1512d 100%)",
                  color: "#fffaf3",
                }}
              >
                <Chip
                  icon={<TravelExploreIcon />}
                  label="Traveler Profile"
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#fffaf3",
                    borderRadius: "999px",
                    "& .MuiChip-icon": {
                      color: "#fffaf3",
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    gap: 3,
                    alignItems: { xs: "flex-start", md: "center" },
                  }}
                >
                  <Box display="flex" gap={2.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: { xs: 64, sm: 82 },
                        height: { xs: 64, sm: 82 },
                        bgcolor: "#f7c873",
                        color: "#233142",
                        fontSize: { xs: "1.6rem", sm: "2rem" },
                        fontWeight: 700,
                        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          fontSize: { xs: "2rem", md: "2.5rem" },
                          fontWeight: 700,
                          lineHeight: 1.1,
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Box
                        display="flex"
                        gap={1}
                        alignItems="center"
                        flexWrap="wrap"
                        mt={1}
                      >
                        <EmailOutlinedIcon sx={{ fontSize: "1rem" }} />
                        <Typography sx={{ opacity: 0.92 }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleClick}
                    variant="contained"
                    startIcon={<LogoutRoundedIcon />}
                    sx={{
                      bgcolor: "#fffaf3",
                      color: "#233142",
                      borderRadius: "999px",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                      alignSelf: { xs: "stretch", md: "center" },
                      "&:hover": {
                        bgcolor: "#f3e8d6",
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  bgcolor: "#fffdf8",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#f4ede1",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#7b8794",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Diaries Shared
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#233142",
                      fontSize: "2rem",
                      fontWeight: 700,
                    }}
                  >
                    {postsCount}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#eef3f8",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#7b8794",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Favorite Vibe
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#233142",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    Story Collector
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#fbe8df",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#7b8794",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Next Step
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#233142",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    Add your next adventure
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            <Box sx={{ px: { xs: 0.5, md: 1 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#233142",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: { xs: "1.7rem", md: "2.1rem" },
                      fontWeight: 700,
                    }}
                  >
                    Your Travel Diaries
                  </Typography>
                  <Typography sx={{ color: "#6b7280", mt: 0.5 }}>
                    A personal map of the places and moments you chose to keep.
                  </Typography>
                </Box>
                <Chip
                  icon={<MenuBookOutlinedIcon />}
                  label={`${postsCount} entries`}
                  sx={{
                    bgcolor: "#233142",
                    color: "#fffaf3",
                    borderRadius: "999px",
                    "& .MuiChip-icon": {
                      color: "#fffaf3",
                    },
                  }}
                />
              </Box>
              <Divider sx={{ mb: 3, borderColor: "rgba(35, 49, 66, 0.12)" }} />
            </Box>

            {postsCount > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  justifyItems: "center",
                }}
              >
                {user.posts.map((post, index) => (
                  <DiaryItem
                    key={post._id || post.id || index}
                    title={post.title}
                    date={post.date}
                    description={post.description}
                    id={post._id || post.id}
                    image={post.image}
                    location={post.location}
                    user={user._id}
                    name={user.name}
                  />
                ))}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 5 },
                  textAlign: "center",
                  borderRadius: 5,
                  bgcolor: "#fffdf8",
                  border: "1px dashed rgba(35, 49, 66, 0.18)",
                }}
              >
                <Typography
                  sx={{
                    color: "#233142",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Your journal is waiting for its first chapter
                </Typography>
                <Typography sx={{ color: "#6b7280", mb: 3 }}>
                  Share the place that made you pause, laugh, wander, or come
                  alive.
                </Typography>
                <Button
                  onClick={() => navigate("/add")}
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
                  Create First Diary
                </Button>
              </Paper>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Profile;
